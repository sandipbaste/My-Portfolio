import uuid
import os
from typing import List, Dict, Any
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
import google.generativeai as genai

class ChatService:
    def __init__(self):
        self.sessions = {}
        self.vector_store = None
        self.qa_chain = None
        self.setup_rag_system()
    
    def load_documents(self):
        """Load documents from PDF and LinkedIn data"""
        documents = []
        
        # Load resume PDF
        try:
            if os.path.exists("../data/resume.pdf"):
                loader = PyPDFLoader("../data/resume.pdf")
                documents.extend(loader.load())
        except Exception as e:
            print(f"Error loading PDF: {e}")
        
        # Add LinkedIn profile data as document
        linkedin_data = """
        Madelyn Torff - UI/UX Designer

        Professional Experience:
        - Senior UI/UX Designer at TechCorp (2020-Present)
        - Product Designer at DesignStudio (2018-2020)
        - Junior Designer at CreativeLab (2016-2018)

        Skills:
        - User Interface Design
        - User Experience Research
        - Prototyping & Wireframing
        - Figma, Sketch, Adobe XD
        - HTML/CSS, JavaScript
        - React, Tailwind CSS

        Education:
        - Bachelor of Design in Graphic Design, Design University (2012-2016)

        Projects:
        - E-Commerce Platform Redesign: Improved conversion by 35%
        - Mobile Banking App: Served 50k+ users with 4.8-star rating
        - Healthcare Dashboard: Streamlined patient data visualization

        Certifications:
        - Google UX Design Professional Certificate
        - AWS Cloud Practitioner
        - Scrum Master Certified

        Languages:
        - English (Native)
        - Spanish (Professional)

        Achievements:
        - Best UX Design Award 2023
        - Featured in Design Magazine 2022
        - Top Performer Award 2021
        """
        
        linkedin_doc = Document(
            page_content=linkedin_data,
            metadata={"source": "linkedin_profile"}
        )
        documents.append(linkedin_doc)
        
        return documents
    
    def setup_rag_system(self):
        """Initialize RAG system with FAISS and Gemini"""
        try:
            # Initialize embeddings
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Load and process documents
            documents = self.load_documents()
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            # Create FAISS vector store
            self.vector_store = FAISS.from_documents(chunks, self.embeddings)
            
            # Initialize Gemini
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            
            llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=os.getenv("GEMINI_API_KEY"),
                temperature=0.1
            )
            
            # Create QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True
            )
            
            print("RAG system initialized successfully")
            
        except Exception as e:
            print(f"Error setting up RAG system: {e}")
            raise
    
    async def get_response(self, message: str, session_id: str = None) -> Dict[str, Any]:
        """Get response from RAG system"""
        if not session_id:
            session_id = str(uuid.uuid4())
        
        if not self.qa_chain:
            return {
                "response": "I'm still initializing. Please try again in a moment.",
                "session_id": session_id,
                "sources": []
            }
        
        try:
            # Get response from RAG system
            result = self.qa_chain({"query": message})
            
            response = {
                "response": result["result"],
                "session_id": session_id,
                "sources": list(set([doc.metadata.get("source", "Resume") for doc in result.get("source_documents", [])]))
            }
            
            return response
            
        except Exception as e:
            print(f"Error getting response: {e}")
            return {
                "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
                "session_id": session_id,
                "sources": []
            }