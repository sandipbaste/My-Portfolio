from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from app.services.chat_services import ChatService
from app.services.email_service import EmailService
from app.database.database import save_chat_message, save_contact_form

load_dotenv()

app = FastAPI(title="Portfolio Chatbot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
chat_service = ChatService()
email_service = EmailService()

class ChatMessage(BaseModel): 
    message: str
    session_id: Optional[str] = None
    user_ip: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    sources: List[str]

class ContactForm(BaseModel):
    name: str
    email: str
    message: str
    user_ip: Optional[str] = None

def get_client_ip(request: Request):
    if request.client:
        return request.client.host
    return None

@app.get("/")
async def root():
    return {"message": "Portfolio Chatbot API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage, request: Request):
    try:
        # Get client IP if not provided
        if not chat_message.user_ip:
            chat_message.user_ip = get_client_ip(request)
        
        response = await chat_service.get_response(
            chat_message.message, 
            chat_message.session_id
        )
        
        # Save chat message to database
        await save_chat_message(
            session_id=chat_message.session_id or "unknown",
            user_message=chat_message.message,
            bot_response=response["response"],
            user_ip=chat_message.user_ip
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/contact")
async def contact_form(contact_data: ContactForm, request: Request):
    try:
        # Get client IP if not provided
        if not contact_data.user_ip:
            contact_data.user_ip = get_client_ip(request)
        
        # Save contact form to database
        contact_id = await save_contact_form(
            name=contact_data.name,
            email=contact_data.email,
            message=contact_data.message,
            user_ip=contact_data.user_ip
        )
        
        # Send email notification to yourself
        email_sent = await email_service.send_contact_email(
            contact_data.name,
            contact_data.email,
            contact_data.message
        )
        
        # Send auto-reply to the user
        auto_reply_sent = await email_service.send_auto_reply(
            contact_data.email,
            contact_data.name
        )
        
        return {
            "message": "Contact form submitted successfully",
            "contact_id": contact_id,
            "email_sent": email_sent,
            "auto_reply_sent": auto_reply_sent
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Portfolio API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)