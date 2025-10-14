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
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                print("❌ GOOGLE_API_KEY not found in environment variables")
                raise ValueError("Please set GOOGLE_API_KEY environment variable")
            
            genai.configure(api_key=api_key)
            print("✅ Google Generative AI configured successfully")
        except Exception as e:
            print(f"❌ Error configuring Google API: {e}")
            raise

    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        text = re.sub(r'\s+', ' ', text)
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
                
                for doc in documents:
                    doc.page_content = self.clean_text(doc.page_content)
                
                if documents:
                    print("First page content preview:")
                    print(documents[0].page_content[:300] + "...")
            else:
                print(f"❌ Resume not found at: {resume_path}")
                # Enhanced fallback with GitHub information
                fallback_content = """
                Sandip Baste - AI/ML Developer

                CONTACT: 
                Email: sandipbaste999@gmail.com
                Phone: +91 9767952471
                GitHub: github.com/sandipbaste
                Location: Nashik, Maharashtra, India
                LinkedIn: https://www.linkedin.com/in/sandipbaste999
                SUMMARY:
                AI/ML Developer with strong specialization in Generative AI and Large Language Models (LLMs). 
                Proven ability to build intelligent AI solutions including chatbots, voice assistants and video insight systems.

                TECHNICAL SKILLS:
                Languages: Python
                AI/ML & LLMs: Generative AI, RAG, NLP, AI Agents, LangChain, LangGraph, OpenAI, Hugging Face, Gemini
                Frameworks: FastAPI, ReactJS, NumPy, Pandas, REST APIs
                Databases: MySQL, MongoDB, Vector Databases (Chroma, FAISS)
                Tools: Git, GitHub, Docker, Postman, Vercel, Netlify

                PROJECTS:
                1. AI WhatsApp Chatbot - Python, Gemini API, PyAutoGUI, Piperclip
                2. AI Voice Assistant - Nora - Python, Gemini API, SpeechRecognition, pyttsx3
                3. Video Insight Extractor - Python, FFmpeg, Faster-Whisper, FastAPI, Gemini API

                EDUCATION:
                M.Sc. (Computer Science) - K.K. Wagh College - CGPA: 7.91
                B.Sc. (Computer Science) - K.K. Wagh College - CGPA: 8.27
                """
                fallback = Document(
                    page_content=self.clean_text(fallback_content),
                    metadata={"source": "fallback_resume"}
                )
                documents.append(fallback)
                print("✅ Using enhanced fallback resume content")
                
        except Exception as e:
            print(f"❌ Error loading resume: {e}")
            emergency_fallback = Document(
                page_content="Sandip Baste - AI/ML Developer. Email: sandipbaste999@gmail.com. GitHub: github.com/sandipbaste. Skills: Python, Generative AI, LLMs.",
                metadata={"source": "emergency_fallback"}
            )
            documents.append(emergency_fallback)
            
        return documents

    def setup_rag_system(self):
        try:
            print("🚀 Initializing RAG system with Google Gemini...")
            
            # Setup Google Gemini LLM with correct model name
            print("🤖 Setting up Gemini model...")
            try:
                # Try different model names
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash",  # Use gemini-2.5-flash which is widely available
                    temperature=0.3,
                    google_api_key=os.getenv("GOOGLE_API_KEY")
                )
                print("✅ Gemini Pro model ready")
            except Exception as e:
                print(f"❌ Gemini Pro not available: {e}")
                try:
                    # Fallback to gemini-2.5-flash
                    self.llm = ChatGoogleGenerativeAI(
                        model="gemini-2.5-flash",
                        temperature=0.3,
                        google_api_key=os.getenv("GOOGLE_API_KEY")
                    )
                    print("✅ Gemini 2.5 flash model ready")
                except Exception as e2:
                    print(f"❌ All Gemini models failed: {e2}")
                    self.llm = None

            # Setup Google Embeddings
            print("🔧 Setting up text-embedding-004 embeddings...")
            try:
                embeddings = GoogleGenerativeAIEmbeddings(
                    model="models/text-embedding-004",
                    google_api_key=os.getenv("GOOGLE_API_KEY")
                )
                print("✅ Embeddings ready")
            except Exception as e:
                print(f"❌ Error setting up embeddings: {e}")
                # Fallback to local embeddings if Google embeddings fail
                from langchain_huggingface import HuggingFaceEmbeddings
                embeddings = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2",
                    model_kwargs={'device': 'cpu'}
                )
                print("✅ Using fallback local embeddings")

            # Load and process documents
            documents = self.load_documents()
            
            if not documents:
                print("❌ No documents loaded!")
                return

            print(f"📄 Processing {len(documents)} documents...")
            
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=150,
            )
            
            chunks = splitter.split_documents(documents)
            print(f"✂️ Created {len(chunks)} chunks")
            
            # Create FAISS vector store
            print("🔧 Creating FAISS vector store...")
            self.vector_store = FAISS.from_documents(chunks, embeddings)
            
            # Setup retriever
            self.retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}
            )
            
            print("✅ FAISS vector store initialized successfully")
            self.is_system_ready = True
            print("🎉 RAG system fully initialized!")

        except Exception as e:
            print(f"❌ Error setting up RAG system: {e}")
            import traceback
            traceback.print_exc()

    def search_in_resume(self, query: str) -> tuple[str, List[str]]:
        """Search for information in the resume"""
        try:
            if not self.retriever:
                print("❌ No retriever available")
                return "", []
            
            enhanced_query = self.enhance_query(query)
            print(f"🔍 Searching for: '{enhanced_query}'")
            
            relevant_docs = self.retriever.invoke(enhanced_query)
            print(f"📄 Found {len(relevant_docs)} relevant documents")
            
            if not relevant_docs:
                print("❌ No relevant documents found")
                return "", []
            
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
        
        if any(word in query_lower for word in ['github', 'git', 'code', 'repository']):
            return "github git repository code sandipbaste"
        elif any(word in query_lower for word in ['project', 'work', 'developed']):
            return "projects AI WhatsApp Chatbot Nora Voice Assistant Video Insight Extractor"
        elif any(word in query_lower for word in ['skill', 'technology']):
            return "skills Python Generative AI RAG LLMs LangChain FastAPI"
        elif any(word in query_lower for word in ['email', 'contact']):
            return "email contact sandipbaste999@gmail.com"
        elif any(word in query_lower for word in ['phone', 'number']):
            return "phone number 9767952471"
        elif any(word in query_lower for word in ['experience', 'intern']):
            return "experience AI/ML Developer Intern Application Square Infotech"
        elif any(word in query_lower for word in ['education', 'degree']):
            return "education M.Sc. B.Sc. Computer Science"
        elif any(word in query_lower for word in ['summary', 'about', 'who is']):
            return "summary AI/ML Developer Generative AI LLMs"
        
        return query

    def is_resume_related_query(self, query: str) -> bool:
        """Check if the query is related to resume content"""
        resume_keywords = [
            'sandip', 'baste', 'resume', 'cv', 'experience', 
            'skills', 'projects', 'education', 'work', 'job',
            'background', 'developer', 'engineer', 'ml', 'ai', 'python',
            'contact', 'email', 'github', 'phone', 'number', 'summary', 'about'
        ]
        
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in resume_keywords)

    async def get_general_knowledge_response(self, query: str) -> str:
        """Get response for general knowledge questions"""
        try:
            if not self.llm:
                return f"I can provide general information about '{query}'. For detailed information, please check reliable sources."
            
            prompt = f""" You are Sandip Assistance Work as a Alexa or google assistance if user ask any general Question then show answer in 2-3 sentence only.
            
            Provide a concise and accurate answer to the following question in 2-3 sentences:

            Question: {query}

            Answer:"""
            
            response = await self.llm.ainvoke(prompt)
            return response.content.strip()
                
        except Exception as e:
            print(f"❌ Error generating general response: {e}")
            return f"I can provide general information about '{query}'. For detailed information, please check reliable sources."

    async def get_llm_response(self, context: str, question: str) -> str:
        """Get response from LLM with context"""
        try:
            if not self.llm:
                return self.get_fallback_response_based_on_context(context, question)
            
            prompt = f"""You are Sandip Baste's AI assistant. Answer the question based on the provided resume information. 
            Respond in first person as if you are representing Sandip. Be helpful and concise.

            Resume Information: {context}

            Question: {question}

            Answer as Sandip's assistant:"""
            
            response = await self.llm.ainvoke(prompt)
            return response.content.strip()
            
        except Exception as e:
            print(f"❌ Error generating LLM response: {e}")
            return self.get_fallback_response_based_on_context(context, question)

    def get_fallback_response_based_on_context(self, context: str, question: str) -> str:
        """Fallback response when LLM fails"""
        question_lower = question.lower()
        
        if any(word in question_lower for word in ['github', 'git']):
            return "You can find my GitHub profile at: github.com/sandipbaste"
        elif any(word in question_lower for word in ['email']):
            return "You can reach me at: sandipbaste999@gmail.com"
        elif any(word in question_lower for word in ['phone', 'number']):
            return "My contact number is: +91 9767952471"
        elif any(word in question_lower for word in ['project']):
            return self.format_projects_response(context)
        elif any(word in question_lower for word in ['skill']):
            return self.extract_skills_response(context)
        else:
            return "Asking me a specific topics like my Experiance, skills, projects, or contact information."

    def format_projects_response(self, context: str) -> str:
        """Format projects information from context"""
        projects_info = []
        
        if "AI WhatsApp Chatbot" in context:
            projects_info.append("• AI WhatsApp Chatbot: Built using Python and Gemini API for automated conversations")
        
        if "Nora" in context or "Voice Assistant" in context:
            projects_info.append("• AI Voice Assistant - Nora: Developed with SpeechRecognition and TTS for voice interactions")
        
        if "Video Insight Extractor" in context:
            projects_info.append("• Video Insight Extractor: Created to extract insights from videos using Faster-Whisper and Gemini API")
        
        if projects_info:
            return "I have worked on the following projects:\n" + "\n".join(projects_info)
        else:
            return "I have experience working on AI projects including chatbots, voice assistants, and video analysis systems."

    async def get_response(self, message: str, session_id: str = None) -> Dict[str, Any]:
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            print(f"💬 Processing query: '{message}'")
            
            cleaned_message = message.strip().lower()
            
            # Handle greetings
            if cleaned_message in ['hi', 'hello', 'hey']:
                response_text = "Hello! I'm Sandip's AI assistant. What can I help you learn about Sandip today?"
                sources = ["greeting"]
                
            # Handle resume-related queries
            elif self.is_resume_related_query(cleaned_message):
                print("🔍 Searching in resume...")
                context, sources = self.search_in_resume(message)
                
                if context:
                    # Direct responses for specific queries without LLM
                    if any(word in cleaned_message for word in ['github', 'git']):
                        response_text = "You can find my GitHub profile at: github.com/sandipbaste"
                    
                    elif any(word in cleaned_message for word in ['email']):
                        response_text = "You can reach me at: sandipbaste999@gmail.com"
                    
                    elif any(word in cleaned_message for word in ['phone', 'number', 'contact']):
                        if 'email' not in cleaned_message:
                            response_text = "My contact number is: +91 9767952471"
                        else:
                            response_text = "My contact information:\nEmail: sandipbaste999@gmail.com\nPhone: +91 9767952471\nGitHub: github.com/sandipbaste"
                    
                    elif any(word in cleaned_message for word in ['project']):
                        response_text = self.format_projects_response(context)
                    
                    elif any(word in cleaned_message for word in ['skill']):
                        response_text = self.extract_skills_response(context)
                    
                    elif any(word in cleaned_message for word in ['experience']):
                        response_text = self.extract_experience_response(context)
                    
                    elif any(word in cleaned_message for word in ['education']):
                        response_text = self.extract_education_response(context)
                    
                    elif any(word in cleaned_message for word in ['summary', 'about', 'who is']):
                        response_text = self.extract_summary_response(context)
                    
                    else:
                        # Use LLM for other queries
                        response_text = await self.get_llm_response(context, message)
                else:
                    response_text = "I couldn't find specific information about that in my resume. Please ask about my skills, projects, experience, education, or contact information."
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
            
            # Simple fallback responses
            if any(greet in cleaned_message for greet in ['hi', 'hello', 'hey']):
                fallback_response = "Hello! I'm Sandip's AI assistant. What can I help you learn about Sandip today?"
            elif any(word in cleaned_message for word in ['github']):
                fallback_response = "You can find my GitHub profile at: github.com/sandipbaste"
            elif any(word in cleaned_message for word in ['email']):
                fallback_response = "You can reach me at: sandipbaste999@gmail.com"
            elif any(word in cleaned_message for word in ['project']):
                fallback_response = "I have worked on AI projects including WhatsApp Chatbot, Voice Assistant Nora, and Video Insight Extractor."
            elif any(word in cleaned_message for word in ['skill']):
                fallback_response = "My skills include Python, Generative AI, LLMs, LangChain, FastAPI, and various AI technologies."
            else:
                fallback_response = "I'm here to help you learn about Sandip's professional background. Ask about skills, projects, experience, or contact information."
            
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
        if "ReactJS" in context: skills.append("ReactJS")
        
        if skills:
            return f"My technical skills include: {', '.join(skills)}"
        return "I'm skilled in AI/ML technologies including Python, Generative AI, and various AI frameworks."

    def extract_experience_response(self, context: str) -> str:
        return "I worked as an AI/ML Developer Intern at Application Square Infotech, Nashik. I developed chatbot and voicebot applications using LLMs and RAG techniques."

    def extract_education_response(self, context: str) -> str:
        return "I'm pursuing M.Sc. in Computer Science from K.K. Wagh College (CGPA: 7.91) and completed B.Sc. in Computer Science (CGPA: 8.27)."

    def extract_summary_response(self, context: str) -> str:
        return "I'm Sandip Baste, an AI/ML Developer specializing in Generative AI and Large Language Models. I build intelligent AI solutions including chatbots and voice assistants."