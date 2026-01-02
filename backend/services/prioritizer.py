from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
try:
    from backend.utils.models import load_pickle, get_model_path
except ImportError:
    from utils.models import load_pickle, get_model_path
try:
    from backend.utils.preprocessing import preprocess_text
except ImportError:
    from utils.preprocessing import preprocess_text
import os

router = APIRouter()

# Centralized Path Resolution
PIPELINE_PATH = get_model_path("Case Prioritization", "stacking_pipeline.pkl")
LABEL_PATH = get_model_path("Case Prioritization", "label_encoder.pkl")
print(f">>> [Prioritizer] PIPELINE_PATH: {PIPELINE_PATH}")

print(">>> [Prioritizer] Loading models...")
# Global model variables
pipeline = None
label_encoder = None

def load_prioritizer_models():
    global pipeline, label_encoder
    if pipeline is None:
        print(">>> [Prioritizer] Loading models...")
        pipeline = load_pickle(PIPELINE_PATH)
        label_encoder = load_pickle(LABEL_PATH)
        print(">>> [Prioritizer] Models loaded.")

class CaseInput(BaseModel):
    text: str

@router.post("/prioritize")
async def prioritize_case(case: CaseInput):
    load_prioritizer_models()
    if not case.text.strip():
        raise HTTPException(status_code=400, detail="Text input is empty.")
    
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Prioritization model not loaded.")
    
    cleaned = preprocess_text(case.text)
    pred_enc = pipeline.predict([cleaned])
    pred_label = label_encoder.inverse_transform(pred_enc)[0] if label_encoder else str(pred_enc[0])
    
    return {"priority": pred_label}
