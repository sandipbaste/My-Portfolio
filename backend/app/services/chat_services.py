import uuid
import os
import re
from typing import List, Dict, Any
import google.generativeai as genai
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI

class ChatService:
    def __init__(self):
        self.sessions = {}
        self.vector_store = None
        self.llm = None
        self.retriever = None
        self.is_system_ready = False
        
        # Configure Google API
        self.configure_google_api()
        self.setup_rag_system()

    def configure_google_api(self):
        """Configure Google Generative AI API"""
        try:
            # You need to set your GOOGLE_API_KEY as environment variable
            # or replace with your actual API key
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                print("❌ GOOGLE_API_KEY not found in environment variables")
                # You can set it here temporarily for testing (remove in production)
                # api_key = "your_google_api_key_here"
                raise ValueError("Please set GOOGLE_API_KEY environment variable")
            
            genai.configure(api_key=api_key)
            print("✅ Google Generative AI configured successfully")
        except Exception as e:
            print(f"❌ Error configuring Google API: {e}")
            raise

    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove extra whitespace but keep structure
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep basic punctuation and symbols
        text = re.sub(r'[^\w\s.,!?;:()\-@#&+*%/]', '', text)
        return text.strip()

    def load_documents(self) -> List[Document]:
        documents = []
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            resume_path = os.path.join(base_dir, "..", "data", "resume.pdf")
            
            if os.path.exists(resume_path):
                print(f"✅ Found resume at: {resume_path}")
                loader = PyPDFLoader(resume_path)
                documents.extend(loader.load())
                print(f"✅ Loaded resume with {len(documents)} pages")
                
                # Clean the document content
                for doc in documents:
                    doc.page_content = self.clean_text(doc.page_content)
                
                # Print cleaned content sample
                if documents:
                    print("First page content preview:")
                    print(documents[0].page_content[:300] + "...")
            else:
                print(f"❌ Resume not found at: {resume_path}")
                # Create fallback content based on actual resume structure
                fallback_content = """
                Sandip Baste - AI/ML Developer

                CONTACT: Nashik, Maharashtra, India | Phone: +91 9767952471 | Email: sandipbaste999@gmail.com

                SUMMARY:
                AI/ML Developer with strong specialization in Generative AI and Large Language Models (LLMs). 
                Proven ability to build intelligent AI solutions including chatbots, voice assistants and video insight systems.
                Proficient in LangChain, OpenAI APIs, Gemini, FastAPI and developing scalable RAG pipelines.

                PROFESSIONAL EXPERIENCE:
                AI/ML Developer Intern at Application Square Infotech, Nashik
                - Designed and developed dynamic chatbot and voicebot applications using LLMs and RAG techniques
                - Integrated real-time speech recognition and TTS using gTTS, Google Speech API and pyttsx3
                - Built scalable FastAPI backends with modular chatbot-specific endpoints
                - Created custom AI pipelines combining embeddings, retrievers, memory chains and RAG workflows

                PROJECTS:
                1. AI WhatsApp Chatbot - Python, Gemini API, PyAutoGUI, Piperclip
                - AI-powered WhatsApp chatbot for automated, human-like conversations
                - Uses Gemini API with PyAutoGUI and Piperclip for natural interactions

                2. AI Voice Assistant - Nora - Python, Gemini API, SpeechRecognition, pyttsx3, ReactJS, Tailwind CSS
                - AI-powered voice assistant with context-aware dialogue using Gemini API
                - Voice input via SpeechRecognition and TTS output with pyttsx3
                - Features include web search, music playback and news updates

                3. Video Insight Extractor - Python, FFmpeg, Faster-Whisper, FastAPI, Gemini API
                - Extracts insights from long videos using FFmpeg, Faster-Whisper and Gemini API
                - FastAPI backend for natural-language Q&A on video content

                TECHNICAL SKILLS:
                Languages: Python
                AI/ML & LLMs: Generative AI, RAG, NLP, AI Agents, LangChain, LangGraph, OpenAI, Hugging Face, Gemini
                Frameworks: FastAPI, ReactJS, NumPy, Pandas, REST APIs
                Databases: MySQL, MongoDB, Vector Databases (Chroma, FAISS)
                Tools: Dialogflow CX, Postman, Git, GitHub, Docker, Vercel, Netlify

                EDUCATION:
                M.Sc. (Computer Science) - K.K. Wagh Art's, Science and Commerce College - CGPA: 7.91 (2023-2025)
                B.Sc. (Computer Science) - K.K. Wagh Art's, Science and Commerce College - CGPA: 8.27 (2020-2023)
                """
                fallback = Document(
                    page_content=self.clean_text(fallback_content),
                    metadata={"source": "fallback_resume"}
                )
                documents.append(fallback)
                print("✅ Using fallback resume content")
                
        except Exception as e:
            print(f"❌ Error loading resume: {e}")
            emergency_fallback = Document(
                page_content="Sandip Baste - AI/ML Developer. Contact: sandipbaste999@gmail.com. Skills: Python, Generative AI, LLMs, LangChain, FastAPI.",
                metadata={"source": "emergency_fallback"}
            )
            documents.append(emergency_fallback)
            
        return documents

    def setup_rag_system(self):
        try:
            print("🚀 Initializing RAG system with Google Gemini...")
            
            # Setup Google Gemini LLM
            print("🤖 Setting up Gemini 2.5 Flash...")
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",  # Using 1.5-flash as 2.5 might not be available yet
                temperature=0.3,
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
            print("✅ Gemini LLM ready")

            # Setup Google Embeddings
            print("🔧 Setting up text-embedding-004 embeddings...")
            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/text-embedding-004",
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
            print("✅ Embeddings ready")

            # Load and process documents
            documents = self.load_documents()
            
            if not documents:
                print("❌ No documents loaded!")
                return

            print(f"📄 Processing {len(documents)} documents...")
            
            # Better text splitting for resume content
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,  # Larger chunks for better context
                chunk_overlap=150,
                length_function=len,
                separators=["\n\n", "\n", ". ", "! ", "? ", "; ", ", ", " "]
            )
            
            chunks = splitter.split_documents(documents)
            print(f"✂️ Created {len(chunks)} chunks")
            
            # Print sample chunks to verify content
            print("Sample chunks:")
            for i, chunk in enumerate(chunks[:3]):
                print(f"Chunk {i+1}: {chunk.page_content[:100]}...")

            # Create FAISS vector store
            print("🔧 Creating FAISS vector store...")
            self.vector_store = FAISS.from_documents(chunks, embeddings)
            
            # Setup retriever with similarity search
            self.retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={
                    "k": 3,  # Get top 3 most relevant chunks
                }
            )
            
            print("✅ FAISS vector store initialized successfully")
            self.is_system_ready = True
            print("🎉 RAG system fully initialized and ready with Gemini!")

        except Exception as e:
            print(f"❌ Error setting up RAG system: {e}")
            import traceback
            traceback.print_exc()

    def search_in_resume(self, query: str) -> tuple[str, List[str]]:
        """Search for information in the resume with enhanced query processing"""
        try:
            if not self.retriever:
                print("❌ No retriever available")
                return "", []
            
            # Enhance query for better search
            enhanced_query = self.enhance_query(query)
            print(f"🔍 Searching for: '{enhanced_query}'")
            
            relevant_docs = self.retriever.invoke(enhanced_query)
            print(f"📄 Found {len(relevant_docs)} relevant documents")
            
            if not relevant_docs:
                print("❌ No relevant documents found")
                return "", []
            
            # Combine context from relevant documents
            context_parts = []
            for i, doc in enumerate(relevant_docs):
                content_preview = doc.page_content[:150] + "..." if len(doc.page_content) > 150 else doc.page_content
                print(f"   📖 Document {i+1}: {content_preview}")
                context_parts.append(doc.page_content)
            
            context = "\n\n".join(context_parts)
            sources = list(set([doc.metadata.get("source", "Resume") for doc in relevant_docs]))
            
            return context, sources
            
        except Exception as e:
            print(f"❌ Error searching resume: {e}")
            return "", []

    def enhance_query(self, query: str) -> str:
        """Enhance query for better search results"""
        query_lower = query.lower()
        
        # Map queries to resume sections
        if any(word in query_lower for word in ['project', 'work', 'developed', 'built']):
            return "projects " + query + " AI WhatsApp Chatbot Nora Voice Assistant Video Insight Extractor"
        elif any(word in query_lower for word in ['skill', 'technology', 'tech', 'language']):
            return "skills " + query + " Python Generative AI RAG LLMs LangChain FastAPI"
        elif any(word in query_lower for word in ['experience', 'job', 'work', 'intern']):
            return "experience " + query + " AI/ML Developer Intern Application Square Infotech"
        elif any(word in query_lower for word in ['education', 'degree', 'study', 'college']):
            return "education " + query + " M.Sc. B.Sc. Computer Science K.K. Wagh College"
        elif any(word in query_lower for word in ['contact', 'email', 'phone', 'number']):
            return "contact " + query + " sandipbaste999@gmail.com 9767952471 Nashik"
        elif any(word in query_lower for word in ['summary', 'about', 'who is']):
            return "summary " + query + " AI/ML Developer Generative AI LLMs"
        elif 'nora' in query_lower:
            return "Nora AI Voice Assistant project"
        elif 'whatsapp' in query_lower:
            return "WhatsApp Chatbot project"
        elif 'video' in query_lower:
            return "Video Insight Extractor project"
        
        return query

    def is_resume_related_query(self, query: str) -> bool:
        """Check if the query is related to resume content"""
        resume_keywords = [
            'sandip', 'baste', 'resume', 'cv', 'profile', 'experience', 
            'skills', 'projects', 'education', 'work', 'job', 'career',
            'background', 'qualification', 'technical', 'professional',
            'developer', 'engineer', 'ml', 'ai', 'python', 'fastapi',
            'langchain', 'tensorflow', 'pytorch', 'machine learning',
            'deep learning', 'chatbot', 'model', 'deployment', 'contact',
            'email', 'linkedin', 'github', 'nora', 'whatsapp', 'video',
            'voice assistant', 'summary', 'about'
        ]
        
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in resume_keywords)

    async def get_general_knowledge_response(self, query: str) -> str:
        """Get response for general knowledge questions using Gemini"""
        try:
            prompt = f"""Provide a helpful and concise answer to the following question in 2-3 sentences:

            Question: {query}

            Answer:"""
            
            response = await self.llm.ainvoke(prompt)
            return response.content.strip()
                
        except Exception as e:
            print(f"❌ Error generating general response: {e}")
            return f"I can provide general information about '{query}'. For detailed information, please check reliable sources."

    async def get_llm_response(self, context: str, question: str) -> str:
        """Get response from Gemini LLM with context"""
        try:
            prompt = f"""Based on the following resume information, answer the question clearly and concisely:

            Resume Information: {context}

            Question: {question}

            Helpful Answer:"""
            
            response = await self.llm.ainvoke(prompt)
            return response.content.strip()
            
        except Exception as e:
            print(f"❌ Error generating LLM response: {e}")
            return "I found relevant information but encountered an error generating the response."

    def format_projects_response(self, context: str) -> str:
        """Format projects information from context"""
        projects_info = []
        
        # Extract project information
        if "AI WhatsApp Chatbot" in context:
            projects_info.append("• AI WhatsApp Chatbot: Python, Gemini API, PyAutoGUI - AI-powered WhatsApp chatbot for automated conversations")
        
        if "Nora" in context or "Voice Assistant" in context:
            projects_info.append("• AI Voice Assistant - Nora: Python, Gemini API, SpeechRecognition - Voice assistant with web search and music playback")
        
        if "Video Insight Extractor" in context:
            projects_info.append("• Video Insight Extractor: Python, FFmpeg, Faster-Whisper - Extracts insights from long videos using AI")
        
        if projects_info:
            return "Sandip has worked on the following projects:\n" + "\n".join(projects_info)
        else:
            return "Sandip has worked on AI projects including chatbots, voice assistants, and video analysis systems using Python and various AI technologies."

    async def get_response(self, message: str, session_id: str = None) -> Dict[str, Any]:
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            print(f"💬 Processing query: '{message}'")
            
            cleaned_message = message.strip().lower()
            
            # Handle greetings
            if cleaned_message in ['hi', 'hello', 'hey', 'hi there', 'hello there']:
                response_text = "Hello! What can I help you with today?"
                sources = ["greeting"]
                
            # Handle resume-related queries
            elif self.is_resume_related_query(cleaned_message):
                print("🔍 Searching in resume...")
                context, sources = self.search_in_resume(message)
                
                if context:
                    # Check query type and format response accordingly
                    if any(word in cleaned_message for word in ['project', 'work']):
                        response_text = self.format_projects_response(context)
                    elif any(word in cleaned_message for word in ['skill', 'technology']):
                        response_text = self.extract_skills_response(context)
                    elif any(word in cleaned_message for word in ['experience', 'intern']):
                        response_text = self.extract_experience_response(context)
                    elif any(word in cleaned_message for word in ['education', 'degree']):
                        response_text = self.extract_education_response(context)
                    elif any(word in cleaned_message for word in ['contact', 'email', 'phone']):
                        response_text = self.extract_contact_response(context)
                    elif any(word in cleaned_message for word in ['summary', 'about', 'who is']):
                        response_text = self.extract_summary_response(context)
                    else:
                        # Use Gemini for other queries
                        response_text = await self.get_llm_response(context, message)
                else:
                    response_text = "I couldn't find specific information about that in the resume. Please ask about skills, projects, experience, education, or contact information."
                    sources = ["resume_not_found"]
            
            # Handle general knowledge questions
            else:
                print("🌍 Handling general knowledge question...")
                response_text = await self.get_general_knowledge_response(message)
                sources = ["general_knowledge"]
            
            print(f"🤖 Generated response: {response_text}")
            print(f"📚 Sources: {sources}")
            
            return {
                "response": response_text, 
                "session_id": session_id, 
                "sources": sources
            }

        except Exception as e:
            print(f"❌ Error generating response: {e}")
            import traceback
            traceback.print_exc()
            
            if any(greet in cleaned_message for greet in ['hi', 'hello', 'hey']):
                fallback_response = "Hello! What can I help you with today?"
            elif self.is_resume_related_query(cleaned_message):
                fallback_response = "Sandip Baste is an AI/ML Developer specializing in Generative AI and LLMs. He has experience with chatbots, voice assistants, and has worked on projects like AI WhatsApp Chatbot, Nora Voice Assistant, and Video Insight Extractor."
            else:
                fallback_response = f"I can help with information about '{message}'. What specific aspect would you like to know?"
            
            return {
                "response": fallback_response,
                "session_id": session_id,
                "sources": ["system_fallback"]
            }

    # Helper methods for extracting specific information
    def extract_skills_response(self, context: str) -> str:
        skills = []
        if "Python" in context: skills.append("Python")
        if "Generative AI" in context: skills.append("Generative AI")
        if "LLMs" in context: skills.append("Large Language Models")
        if "LangChain" in context: skills.append("LangChain")
        if "FastAPI" in context: skills.append("FastAPI")
        if "RAG" in context: skills.append("RAG")
        if "OpenAI" in context: skills.append("OpenAI")
        if "Gemini" in context: skills.append("Gemini")
        if "TensorFlow" in context: skills.append("TensorFlow")
        if "PyTorch" in context: skills.append("PyTorch")
        
        if skills:
            return f"Sandip's technical skills include: {', '.join(skills)}"
        return "Sandip is skilled in AI/ML technologies including Python, Generative AI, and various AI frameworks."

    def extract_experience_response(self, context: str) -> str:
        return "Sandip worked as an AI/ML Developer Intern at Application Square Infotech, Nashik. He developed chatbot and voicebot applications using LLMs and RAG techniques, and built scalable FastAPI backends."

    def extract_education_response(self, context: str) -> str:
        return "Sandip is pursuing M.Sc. in Computer Science from K.K. Wagh College (CGPA: 7.91) and completed B.Sc. in Computer Science (CGPA: 8.27) from the same college."

    def extract_contact_response(self, context: str) -> str:
        return "Contact Sandip at: Email - sandipbaste999@gmail.com | Phone - +91 9767952471 | Location - Nashik, Maharashtra, India"

    def extract_summary_response(self, context: str) -> str:
        return "Sandip Baste is an AI/ML Developer specializing in Generative AI and Large Language Models. He builds intelligent AI solutions including chatbots, voice assistants, and has expertise in LangChain, FastAPI, and RAG pipelines."