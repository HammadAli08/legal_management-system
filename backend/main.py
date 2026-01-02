import warnings
print(">>> [main.py] Loading module...")
warnings.simplefilter(action='ignore', category=FutureWarning)

from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

print(">>> Starting Startup Sequence...")
import sys
import os
# Add the project root to sys.path to resolve 'backend' module when running on Render
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)
print(f">>> sys.path updated with: {parent_dir}")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

print(">>> Importing services...")
try:
    from backend.services import classifier, prioritizer, rag
    print(">>> Services imported successfully from 'backend.services'")
except ImportError as e:
    print(f">>> Falling back to direct 'services' import due to: {e}")
    from services import classifier, prioritizer, rag
    print(">>> Services imported successfully from 'services'")
import uvicorn

print(">>> Initializing FastAPI app...")
app = FastAPI(title="Legal AI API")
print(">>> FastAPI app initialized.")

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
    print(">>> Root endpoint hit!")
    return {"message": "Legal AI API is running"}

print(">>> main.py module loading complete.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
