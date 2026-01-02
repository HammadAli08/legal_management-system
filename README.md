# Legal AI Management System

A prestigious, AI-powered toolkit for judicial professionals, featuring case classification, urgency prioritization, and a context-aware legal assistant trained on thousands of precedents.

## 🏛️ Overview

The Legal AI Management System is designed to revolutionize legal workflows with forensic precision. It leverages modern NLP and Machine Learning techniques to streamline the analysis of legal documents, categorize jurisdictions, and provide rapid research assistance through a Retrieval-Augmented Generation (RAG) pipeline.

### Key Features

-   **⚖️ Case Classification**: Categorizes legal text into Civil, Criminal, or Constitutional jurisdictions using a **Voting Ensemble ML Model**.
-   **⚠️ Case Prioritization**: Identifies high-urgency cases using a **Stacking Regressor/Classifier Pipeline** to ensure critical matters are addressed first.
-   **🤖 Legal Assistant (RAG)**: A conversational AI grounded in a repository of **4000+ Supreme Court Judgments**, utilizing a **Cross-Encoder Reranker Retriever** for extreme accuracy.
-   **🎨 Prestigious UI**: Built with a "Regal Navy, Gold, and Cream" aesthetic for a professional and comfortable research environment.

---

## 🛠️ Technology Stack

### Frontend
-   **React 19** + **TypeScript** + **Vite**
-   **Tailwind CSS** (Custom "Regal" Design System)
-   **Framer Motion** (Smooth transitions & micro-animations)
-   **Lucide React** (Premium iconography)
-   **React Markdown** (Rich legal text rendering)

### Backend
-   **FastAPI** (High-performance Python backend)
-   **Scikit-Learn** (ML Pipelines & Ensembles)
-   **LangChain** (RAG Orchestration)
-   **Qdrant** (Vector Database for precedents)
-   **Groq API** (Llama-3 inference)
-   **NLTK** (Text preprocessing)

---

## 🚀 Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   Groq API Key
-   Qdrant Cloud API Key & Cluster URL

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/HammadAli08/legal_management-system.git
    cd legal_management-system
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    # Create a .env file with:
    # GROQ_API_KEY=your_key
    # QDRANT_API_KEY=your_key
    # QDRANT_URL=your_url
    python -m uvicorn main:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---

## 👥 Development Team

-   **Hammad Ali Tahir** – University of Education Lahore
-   **Muhammad Usama Sharaf** – Data Scientist at Algo
-   **Madiha Farman** – Kohat University of Science and Technology
-   **Muhammad Zeeshan** – Leads University Lahore

---

## 📜 License

This project is developed for educational and research purposes in the field of Legal AI.
