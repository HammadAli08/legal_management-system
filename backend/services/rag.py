from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os

router = APIRouter()

QDRANT_URL = "https://2191fd84-3737-4604-ac35-435135b72cf3.us-east4-0.gcp.cloud.qdrant.io"
COLLECTION_NAME = "legal_precedents"

# Global RAG chain instance
_rag_chain = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatInput(BaseModel):
    message: str
    history: List[ChatMessage] = []

def get_rag_chain():
    global _rag_chain
    if _rag_chain is not None:
        return _rag_chain

    print(">>> [RAG] Loading heavy dependencies...")
    from langchain_qdrant import QdrantVectorStore
    from qdrant_client import QdrantClient
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_groq import ChatGroq
    from langchain_classic.chains import create_retrieval_chain, create_history_aware_retriever
    from langchain_classic.chains.combine_documents import create_stuff_documents_chain
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    
    # Reranking imports
    from langchain_classic.retrievers import ContextualCompressionRetriever
    from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
    from langchain_community.cross_encoders import HuggingFaceCrossEncoder
    print(">>> [RAG] Heavy dependencies loaded.")

    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    
    if not QDRANT_API_KEY or not GROQ_API_KEY:
        error_msg = "Missing environment variables: "
        if not QDRANT_API_KEY: error_msg += "QDRANT_API_KEY "
        if not GROQ_API_KEY: error_msg += "GROQ_API_KEY"
        raise ValueError(error_msg.strip())

    try:
        print(">>> [RAG] Initializing Embeddings (MiniLM-L6)...")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        print(">>> [RAG] Connecting to Qdrant...")
        client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        vector_store = QdrantVectorStore(client=client, collection_name=COLLECTION_NAME, embedding=embeddings)

        print(">>> [RAG] Setting up Retriever (k=20)...")
        base_retriever = vector_store.as_retriever(search_kwargs={"k": 20})

        print(">>> [RAG] Initializing Reranker Model (MS-MARCO MiniLM)...")
        # This model is ~80MB, loading it might take a moment
        rerank_model = HuggingFaceCrossEncoder(model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
        compressor = CrossEncoderReranker(model=rerank_model, top_n=5)
        
        print(">>> [RAG] Creating Compression Retriever...")
        compression_retriever = ContextualCompressionRetriever(base_compressor=compressor, base_retriever=base_retriever)

        print(">>> [RAG] Initializing Groq LLM (Llama 3.3 70B)...")
        llm = ChatGroq(model_name="llama-3.3-70b-versatile", api_key=GROQ_API_KEY, temperature=0.1)

        # Contextualize Question
        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question which might reference context in the chat history, "
            "formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed."
        )
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        print(">>> [RAG] Creating History Aware Retriever...")
        history_aware_retriever = create_history_aware_retriever(llm, compression_retriever, contextualize_q_prompt)

        # QA Prompt
        qa_system_prompt = """
        You are a Senior Legal Research Assistant. Your mandate is to analyze the provided legal documents and answer the user's question with **forensic precision**.
        
        ### CRITICAL INSTRUCTIONS:
        1. **Zero External Knowledge:** You must answer strictly based *only* on the provided "Context" below. Do not use outside legal knowledge, general principles, or laws not explicitly present in the text.
        2. **No Hallucination:** If the answer is not found in the context, you must state: *"The provided legal documents do not contain sufficient information to answer this specific query."* Do not attempt to guess or fabricate an answer.
        3. **Evidence-Based:** Every claim you make must be supported by a specific reference from the text (e.g., "According to Case X...").
        4. **Tone:** Maintain a formal, objective, and non-advisory tone (avoid saying "You should").

        ### REQUIRED OUTPUT FORMAT:
        
        #### 1. Executive Summary
        (A direct, 2-3 sentence answer to the core legal question.)

        #### 2. Relevant Precedents & Analysis
        (Detailed bullet points analyzing the retrieved text.)
        * **[Case/Section Name]:** [Key holding or fact relevant to the question]
        * **[Case/Section Name]:** [Key holding or fact relevant to the question]

        #### 3. Conclusion
        (A final summary statement on the legal position based solely on the provided context.)

        ### CONTEXT:
        {context}
        """
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        print(">>> [RAG] Creating QA Chain...")
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        _rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
        print(">>> [RAG] System Ready.")
        return _rag_chain
    except Exception as e:
        raise RuntimeError(f"Failed to initialize RAG chain: {str(e)}")

@router.post("/chat")
async def chat(input_data: ChatInput):
    try:
        rag_chain = get_rag_chain()
        
        from langchain_core.messages import HumanMessage, AIMessage
        chat_history = []
        for msg in input_data.history:
            if msg.role == "user":
                chat_history.append(HumanMessage(content=msg.content))
            else:
                chat_history.append(AIMessage(content=msg.content))
        
        print(f">>> [RAG] Invoking chain for query: {input_data.message[:50]}...")
        response = rag_chain.invoke({"input": input_data.message, "chat_history": chat_history})
        print(">>> [RAG] Chain response received.")
        
        sources = []
        for doc in response.get("context", []):
            sources.append({
                "content": getattr(doc, 'page_content', "No content available")
            })
            
        return {
            "answer": response['answer'],
            "sources": sources
        }
    except Exception as e:
        # Log the full error to the console for debugging
        print(f"Error in /chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
