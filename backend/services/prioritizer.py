from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.utils.models import load_pickle
from backend.utils.preprocessing import preprocess_text
import os

router = APIRouter()

# Paths relative to the project root
PIPELINE_PATH = "backend/Case Prioritization/stacking_pipeline.pkl"
LABEL_PATH = "backend/Case Prioritization/label_encoder.pkl"

pipeline = load_pickle(PIPELINE_PATH)
label_encoder = load_pickle(LABEL_PATH)

class CaseInput(BaseModel):
    text: str

@router.post("/prioritize")
async def prioritize_case(case: CaseInput):
    if not case.text.strip():
        raise HTTPException(status_code=400, detail="Text input is empty.")
    
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Prioritization model not loaded.")
    
    cleaned = preprocess_text(case.text)
    pred_enc = pipeline.predict([cleaned])
    pred_label = label_encoder.inverse_transform(pred_enc)[0] if label_encoder else str(pred_enc[0])
    
    return {"priority": pred_label}
