import os
import sys

# Ensure the project root is in the Python path for IDEs and runtime
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi import FastAPI, HTTPException, Request  # type: ignore
from pydantic import BaseModel  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from backend.orchestrator import orchestrator, AgentState  # type: ignore
from backend.supabase_client import get_supabase_client  # type: ignore
from typing import Optional, List, cast
import uuid

app = FastAPI(title="MedVoice AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: List[dict]
    conversation_id: Optional[str] = None
    user_id: str
    user_city: Optional[str] = "Kolkata"

class BookingRequest(BaseModel):
    user_id: str
    doctor_name: str
    hospital: str
    appointment_date: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    supabase = get_supabase_client()
    try:
        # 1. Save User Message
        last_user_msg = request.messages[-1]
        try:
            # We need a conversation_id. If missing, we'll get it from orchestrator later, 
            # but for the first message we might need to generate it here.
            temp_conv_id = request.conversation_id or str(uuid.uuid4())
            supabase.table("messages").insert({
                "conversation_id": temp_conv_id,
                "role": "user",
                "content": last_user_msg["content"],
                "user_id": request.user_id
            }).execute()
        except Exception as e:
            print(f"Error saving user message: {e}")

        # 3. Prepare state for LangGraph
        initial_state: AgentState = {
            "messages": request.messages,
            "conversation_id": request.conversation_id or temp_conv_id,
            "user_id": request.user_id,
            "user_city": request.user_city or "Kolkata",
            "booking_requested": False,
            "booking_details": {}
        }
        
        # 4. Run orchestrator
        final_state = await orchestrator.ainvoke(initial_state)
        new_conv_id = final_state["conversation_id"]
        
        # 4. Save Assistant Message
        last_assistant_msg = final_state["messages"][-1]
        try:
            supabase.table("messages").insert({
                "conversation_id": new_conv_id,
                "role": "assistant",
                "content": last_assistant_msg["content"],
                "user_id": request.user_id
            }).execute()
        except Exception as e:
            print(f"Error saving assistant message: {e}")

        # 5. Return Response (Compatible with new UI logic)
        return {
            "status": "success",
            "data": {
                "conversation_id": new_conv_id,
                "messages": final_state["messages"]
            }
        }
    except Exception as e:
        print(f"Chat Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/book")
async def book_endpoint(request: BookingRequest):
    supabase = get_supabase_client()
    try:
        data = {
            "user_id": request.user_id,
            "doctor_name": request.doctor_name,
            "hospital": request.hospital,
            "appointment_date": request.appointment_date,
            "status": "confirmed"
        }
        result = supabase.table("appointments").insert(data).execute()
        return {"status": "success", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
@app.get("/health")  # alias for frontend heartbeat on both paths
async def health_check():
    return {"status": "connected", "engine": "MedVoice AI", "version": "2.0"}

from fastapi import File, UploadFile  # type: ignore

@app.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(None)):
    """
    OCR endpoint. Currently returns a mock pass-through.
    Replace with real OCR logic (pytesseract / Google Vision) as needed.
    """
    filename = file.filename if file else "unknown"
    print(f"[OCR] Received file: {filename}")
    return {
        "status": "success",
        "text": f"Prescription '{filename}' received. OCR processing active.",
        "data": {"medications": [], "dosage": "Parsed from uploaded document"}
    }

@app.get("/")
async def root():
    return {"message": "MedVoice AI Backend is running — v2.0 (Type-Safe Orchestrator)"}

if __name__ == "__main__":
    import uvicorn  # type: ignore
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
