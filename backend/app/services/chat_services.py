import uuid
import os
from typing import List, Dict, Any
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings


class ChatService:
    def __init__(self):
        self.sessions = {}
        self.vector_store = None
        self.qa_chain = None
        self.setup_rag_system()

    def load_documents(self) -> List[Document]:
        """Load documents from resume PDF only"""
        documents = []

        try:
            # Try different possible paths for resume
            possible_paths = [
                "./data/resume.pdf",
                "data/resume.pdf",
                "../data/resume.pdf"
            ]
            
            resume_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    resume_path = path
                    break
            
            if resume_path:
                print(f"Loading resume from: {resume_path}")
                loader = PyPDFLoader(resume_path)
                documents.extend(loader.load())
                print(f"Successfully loaded resume PDF with {len(documents)} pages")
            else:
                print("Resume PDF not found. Using fallback data.")
                fallback_data = """
                Sandip Baste - AI/ML Developer
                
                Professional Experience:
                - AI/ML Developer specializing in Generative AI and Large Language Models
                - Experience in building chatbots, voice assistants, and AI agents
                - Proficient in Python, LangChain, FastAPI, and RAG systems
                
                Skills:
                - Python, LangChain, FastAPI, RAG, Agentic AI
                - ReactJS, Tailwind CSS, MongoDB, Docker, AWS
                - LLM Integration, NLP, Machine Learning
                
                Projects:
                - WhatsApp AI Chatbot with Gemini API
                - Nora - AI Voice Assistant
                - Video Insight Extractor System
                
                Education:
                - Master of Computer Science
                """

                fallback_doc = Document(
                    page_content=fallback_data,
                    metadata={"source": "fallback_profile"}
                )
                documents.append(fallback_doc)

        except Exception as e:
            print(f"Error loading PDF: {e}")
            emergency_doc = Document(
                page_content="Sandip Baste - AI/ML Developer. Specialized in Generative AI, chatbots, and voice assistants. Skills include Python, LangChain, FastAPI, and ReactJS.",
                metadata={"source": "emergency_fallback"}
            )
            documents.append(emergency_doc)

        return documents

    def setup_rag_system(self):
        """Initialize RAG system with Gemini embeddings and FAISS"""
        try:
            gemini_key = os.getenv("GEMINI_API_KEY")
            if not gemini_key:
                raise Exception("GEMINI_API_KEY not found in environment variables")

            print("Initializing RAG system with Gemini embeddings...")

            # Configure Gemini API
            genai.configure(api_key=gemini_key)

            # Gemini embeddings with model text-embedding-004
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="text-embedding-004",
                api_key=gemini_key
            )

            # Load and process documents
            documents = self.load_documents()
            if not documents:
                raise Exception("No documents loaded for RAG system")

            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            print(f"Created {len(chunks)} text chunks from resume")

            # Create FAISS vector store
            self.vector_store = FAISS.from_documents(chunks, self.embeddings)

            # Ensure vector store directory exists
            os.makedirs("./vector_store", exist_ok=True)
            self.vector_store.save_local("./vector_store")
            print("FAISS vector store created and saved locally")

            # Initialize Gemini Chat LLM
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=gemini_key,
                temperature=0.1
            )

            # Create RetrievalQA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True
            )

            print("RAG system initialized successfully with Gemini embeddings!")

        except Exception as e:
            print(f"Error setting up RAG system: {e}")
            try:
                gemini_key = os.getenv("GEMINI_API_KEY")
                if gemini_key:
                    llm = ChatGoogleGenerativeAI(
                        model="gemini-2.5-flash",
                        google_api_key=gemini_key,
                        temperature=0.1
                    )
                    self.qa_chain = llm
                    print("Using fallback LLM without RAG")
                else:
                    raise Exception("No Gemini API key available")
            except Exception as fallback_error:
                print(f"Fallback also failed: {fallback_error}")
                self.qa_chain = None

    async def get_response(self, message: str, session_id: str = None) -> Dict[str, Any]:
        """Get response from RAG system using resume data"""
        if not session_id:
            session_id = str(uuid.uuid4())

        if not self.qa_chain:
            return {
                "response": "I'm still initializing or there was an error setting up the system. Please check if GEMINI_API_KEY is set in your .env file.",
                "session_id": session_id,
                "sources": ["System"]
            }

        try:
            if hasattr(self.qa_chain, 'invoke'):
                # Fallback mode — direct LLM
                result = self.qa_chain.invoke(message)
                response_text = result.content if hasattr(result, 'content') else str(result)
                sources = ["Resume (Direct LLM)"]
            else:
                # Normal RAG mode
                result = self.qa_chain({"query": message})
                response_text = result["result"]
                sources = list(set([doc.metadata.get("source", "Resume") for doc in result.get("source_documents", [])]))

            return {
                "response": response_text,
                "session_id": session_id,
                "sources": sources
            }

        except Exception as e:
            print(f"Error getting response: {e}")
            return {
                "response": f"I apologize, but I'm having trouble processing your request. Error: {str(e)}",
                "session_id": session_id,
                "sources": ["Error"]
            }
