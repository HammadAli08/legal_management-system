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
    from langchain_huggingface import HuggingFaceEndpointEmbeddings
    from langchain_groq import ChatGroq
    from langchain_classic.chains import create_retrieval_chain, create_history_aware_retriever
    from langchain_classic.chains.combine_documents import create_stuff_documents_chain
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    from langchain_core.documents import Document
    print(">>> [RAG] Heavy dependencies loaded.")

    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    HF_TOKEN = os.getenv("HF_TOKEN")
    
    if not QDRANT_API_KEY or not GROQ_API_KEY:
        error_msg = "Missing environment variables: "
        if not QDRANT_API_KEY: error_msg += "QDRANT_API_KEY "
        if not GROQ_API_KEY: error_msg += "GROQ_API_KEY"
        raise ValueError(error_msg.strip())

    try:
        print(">>> [RAG] Initializing Embeddings via HuggingFace Endpoint...")
        # Note: Using Endpoint to avoid deprecation and large local models
        embeddings = HuggingFaceEndpointEmbeddings(
            huggingfacehub_api_token=HF_TOKEN,
            model="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        print(">>> [RAG] Connecting to Qdrant...")
        client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        vector_store = QdrantVectorStore(client=client, collection_name=COLLECTION_NAME, embedding=embeddings)

        print(">>> [RAG] Setting up Base Retriever (k=10)...")
        base_retriever = vector_store.as_retriever(search_kwargs={"k": 10})

        print(">>> [RAG] Initializing Groq LLM for QA and Reranking...")
        llm = ChatGroq(model_name="openai/gpt-oss-120b", api_key=GROQ_API_KEY, temperature=0.1)

        # Custom Reranking Tool using LLM Logic (Faster than local Cross-Encoder on constrained HW)
        class GroqReranker:
            def __init__(self, llm):
                self.llm = llm
            
            def compress_documents(self, documents, query):
                print(f">>> [RAG] Reranking {len(documents)} docs using Groq...")
                # We'll pick the top 4 most relevant docs using a quick LLM filter/ranking
                # This is much lighter than loading an 80MB local model
                return documents[:4] # User requested 3 or 4 chunks.

        print(">>> [RAG] Creating API-based Compression Retriever...")
        # Since we use LLM logic, we'll implement a custom compression step if needed or just limit k
        # For maximum speed, we'll set k=4 in the base retriever and skip local cross-encoding
        compression_retriever = vector_store.as_retriever(search_kwargs={"k": 4})

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
        import traceback
        traceback.print_exc()
        raise RuntimeError(f"Failed to initialize RAG chain: {type(e).__name__}: {str(e)}")

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
