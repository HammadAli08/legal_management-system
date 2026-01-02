import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
from sklearn.exceptions import InconsistentVersionWarning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

import sys
# Add the project root to sys.path to resolve 'backend' module when running on Render
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
try:
    from backend.services import classifier, prioritizer, rag
except ImportError:
    from services import classifier, prioritizer, rag
import uvicorn

app = FastAPI(title="Legal AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(classifier.router, prefix="/api/v1", tags=["Classification"])
app.include_router(prioritizer.router, prefix="/api/v1", tags=["Prioritization"])
app.include_router(rag.router, prefix="/api/v1", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Legal AI API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
