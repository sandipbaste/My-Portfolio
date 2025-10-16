import uuid
import os
import re
import json
import webbrowser
from typing import List, Dict, Any
import google.generativeai as genai
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
import base64
from gtts import gTTS
import io
import time

class ChatService:
    def __init__(self):
        self.sessions = {}
        self.vector_store = None
        self.llm = None
        self.retriever = None
        self.is_system_ready = False
        
        # Social media URLs
        self.social_media_urls = {
            'github': 'https://github.com/sandipbaste',
            'linkedin': 'https://linkedin.com/in/sandipbaste999',
            'instagram': 'https://instagram.com/sandipbaste',
            'facebook': 'https://facebook.com/sandipbaste',
            'twitter': 'https://twitter.com/sandipbaste',
            'portfolio': 'https://sandipbaste.github.io'
        }
        
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

    def text_to_speech_base64(self, text: str) -> str:
        """Convert text to speech using gTTS and return base64 audio"""
        while True: 
            try:
                time.sleep(10000)
                # Clean text for speech
                clean_text = re.sub(r'[^\w\s.,!?;:()\-@#&+*%/]', '', text)
                clean_text = clean_text[:500]  # Limit text length for gTTS
                
                # Create gTTS object
                tts = gTTS(text=clean_text, lang='en', slow=False)
                
                # Save to bytes buffer
                audio_buffer = io.BytesIO()
                tts.write_to_fp(audio_buffer)
                audio_buffer.seek(0)
                
                # Convert to base64
                audio_base64 = base64.b64encode(audio_buffer.read()).decode('utf-8')
                
                print("✅ Text converted to speech successfully")
                return audio_base64
            
            except Exception as e:
                print(f"❌ Error converting text to speech: {e}")
                return ""

    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,!?;:()\-@#&+*%/]', '', text)
        return text.strip()

    def is_social_media_query(self, query: str) -> bool:
        """Check if the query is asking to open social media profiles"""
        query_lower = query.lower()
        
        # Social media platforms
        social_platforms = ['linkedin', 'github', 'instagram', 'facebook', 'twitter', 'portfolio', 'website']
        
        # Action words that indicate opening/visiting
        action_words = ['open', 'launch', 'visit', 'go to', 'navigate to', 'show me']
        
        # Direct requests for profiles
        direct_requests = [
            'your linkedin', 'your github', 'your instagram', 'your facebook', 
            'your twitter', 'your portfolio', 'your website',
            'linkedin profile', 'github profile', 'instagram profile',
            'facebook profile', 'twitter profile'
        ]
        
        # Check for explicit social media requests
        has_action_and_platform = any(action in query_lower for action in action_words) and \
                                 any(platform in query_lower for platform in social_platforms)
        
        has_direct_request = any(request in query_lower for request in direct_requests)
        
        # Check for platform-specific commands
        platform_commands = [
            'open linkedin', 'open github', 'open instagram', 'open facebook', 'open twitter',
            'visit linkedin', 'visit github', 'visit instagram', 'visit facebook', 'visit twitter',
            'go to linkedin', 'go to github', 'go to instagram', 'go to facebook', 'go to twitter',
            'show me linkedin', 'show me github', 'show me instagram', 'show me facebook', 'show me twitter'
        ]
        
        has_platform_command = any(command in query_lower for command in platform_commands)
        
        # Only return True for explicit social media requests
        return has_action_and_platform or has_direct_request or has_platform_command

    def handle_social_media_request(self, query: str) -> Dict[str, Any]:
        """Handle social media profile opening requests"""
        query_lower = query.lower()
        
        # Map queries to social media platforms
        platform_mapping = {
            'linkedin': 'linkedin',
            'github': 'github',
            'git hub': 'github',
            'instagram': 'instagram',
            'insta': 'instagram',
            'facebook': 'facebook',
            'fb': 'facebook',
            'twitter': 'twitter',
            'x': 'twitter',
            'portfolio': 'portfolio',
            'website': 'portfolio'
        }
        
        # Find which platform is being requested
        requested_platform = None
        for keyword, platform in platform_mapping.items():
            if keyword in query_lower:
                requested_platform = platform
                break
        
        if requested_platform and requested_platform in self.social_media_urls:
            url = self.social_media_urls[requested_platform]
            try:
                # Open the URL in the default web browser
                webbrowser.open(url)
                response_text = f"✅ Opening my {requested_platform.capitalize()} profile...\nYou can visit: {url}"
                
                # Generate speech for social media action
                audio_base64 = self.text_to_speech_base64(f"Opening your {requested_platform} profile now.")
                
                return {
                    "response": response_text,
                    "audio": audio_base64,
                    "action": "open_url",
                    "url": url,
                    "platform": requested_platform,
                    "sources": ["social_media"]
                }
            except Exception as e:
                response_text = f"❌ Couldn't open {requested_platform} automatically. You can manually visit: {url}"
                audio_base64 = self.text_to_speech_base64(f"Please manually visit my {requested_platform} profile at {url}")
                
                return {
                    "response": response_text,
                    "audio": audio_base64,
                    "action": "url_only",
                    "url": url,
                    "platform": requested_platform,
                    "sources": ["social_media_error"]
                }
        else:
            # If no specific platform is mentioned, show all available profiles
            profiles_text = "Here are my social media profiles:\n"
            for platform, url in self.social_media_urls.items():
                profiles_text += f"• {platform.capitalize()}: {url}\n"
            profiles_text += "\nWhich one would you like me to open?"
            
            audio_base64 = self.text_to_speech_base64("Here are my social media profiles. Which one would you like me to open?")
            
            return {
                "response": profiles_text,
                "audio": audio_base64,
                "action": "list_profiles",
                "sources": ["social_media_list"]
            }

    def load_resume_from_json(self) -> str:
        """Load and parse resume data from JSON file"""
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            resume_path = os.path.join(base_dir, "..", "data", "resume.json")
            
            if not os.path.exists(resume_path):
                print(f"❌ Resume JSON not found at: {resume_path}")
                return self.get_fallback_resume_content()
            
            print(f"✅ Found resume JSON at: {resume_path}")
            
            with open(resume_path, 'r', encoding='utf-8') as file:
                resume_data = json.load(file)
            
            # Convert JSON to formatted text
            formatted_content = self.format_resume_to_text(resume_data)
            print("✅ Successfully loaded and parsed resume JSON")
            
            return formatted_content
            
        except Exception as e:
            print(f"❌ Error loading resume JSON: {e}")
            return self.get_fallback_resume_content()

    def format_resume_to_text(self, resume_data: Dict[str, Any]) -> str:
        """Convert JSON resume data to formatted text"""
        sections = []
        
        # Personal Information
        personal_info = resume_data.get('personal_info', {})
        sections.append(f"""
        {personal_info.get('full_name', 'Sandip Baste')} - {personal_info.get('title', 'AI/ML Developer')}

        CONTACT:
        Email: {personal_info.get('email', 'sandipbaste999@gmail.com')}
        Phone: {personal_info.get('phone', '+91 9767952471')}
        GitHub: {personal_info.get('github', 'github.com/sandipbaste')}
        LinkedIn: {personal_info.get('linkedin', 'linkedin.com/in/sandipbaste999')}
        Location: {personal_info.get('location', 'Nashik, Maharashtra, India')}
        """)
        
        # Summary
        summary = resume_data.get('summary', '')
        if summary:
            sections.append(f"SUMMARY:\n{summary}")
        
        # Technical Skills
        skills = resume_data.get('skills', [])
        if skills:
            skills_text = "TECHNICAL SKILLS:\n"
            for skill_category in skills:
                category = skill_category.get('category', '')
                items = skill_category.get('items', [])
                if category and items:
                    skills_text += f"{category}: {', '.join(items)}\n"
            sections.append(skills_text)
        
        # Experience
        experience = resume_data.get('experience', [])
        if experience:
            exp_text = "EXPERIENCE:\n"
            for exp in experience:
                company = exp.get('company', '')
                position = exp.get('position', '')
                duration = exp.get('duration', '')
                description = exp.get('description', '')
                technologies = exp.get('technologies', [])
                
                exp_text += f"• {position} at {company} ({duration})\n"
                if description:
                    exp_text += f"  {description}\n"
                if technologies:
                    exp_text += f"  Technologies: {', '.join(technologies)}\n"
            sections.append(exp_text)
        
        # Projects
        projects = resume_data.get('projects', [])
        if projects:
            proj_text = "PROJECTS:\n"
            for i, project in enumerate(projects, 1):
                name = project.get('name', '')
                description = project.get('description', '')
                technologies = project.get('technologies', [])
                github_url = project.get('github_url', '')
                
                proj_text += f"{i}. {name}\n"
                if description:
                    proj_text += f"   {description}\n"
                if technologies:
                    proj_text += f"   Technologies: {', '.join(technologies)}\n"
                if github_url:
                    proj_text += f"   GitHub: {github_url}\n"
            sections.append(proj_text)
        
        # Education
        education = resume_data.get('education', [])
        if education:
            edu_text = "EDUCATION:\n"
            for edu in education:
                institution = edu.get('institution', '')
                degree = edu.get('degree', '')
                duration = edu.get('duration', '')
                grade = edu.get('grade', '')
                
                edu_text += f"• {degree} - {institution} ({duration}) - {grade}\n"
            sections.append(edu_text)
        
        return "\n\n".join(sections)

    def get_fallback_resume_content(self) -> str:
        """Fallback resume content if JSON file fails"""
        return """
        Sandip Baste - AI/ML Developer

        CONTACT: 
        Email: sandipbaste999@gmail.com
        Phone: +91 9767952471
        GitHub: github.com/sandipbaste
        Location: Nashik, Maharashtra, India
        LinkedIn: linkedin.com/in/sandipbaste999
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

    def load_documents(self) -> List[Document]:
        documents = []
        try:
            # Load resume content from JSON
            resume_content = self.load_resume_from_json()
            cleaned_content = self.clean_text(resume_content)
            
            document = Document(
                page_content=cleaned_content,
                metadata={"source": "resume_json", "type": "resume"}
            )
            documents.append(document)
            
            print(f"✅ Created document from JSON with {len(cleaned_content)} characters")
                
        except Exception as e:
            print(f"❌ Error loading documents from JSON: {e}")
            # Emergency fallback
            fallback_content = self.get_fallback_resume_content()
            document = Document(
                page_content=self.clean_text(fallback_content),
                metadata={"source": "emergency_fallback"}
            )
            documents.append(document)
            print("✅ Using fallback resume content")
            
        return documents

    def setup_rag_system(self):
        try:
            print("🚀 Initializing RAG system with Google Gemini...")
            
            # Setup Google Gemini LLM
            print("🤖 Setting up Gemini model...")
            try:
                self.llm = ChatGoogleGenerativeAI(
                    model="gemini-2.5-flash",
                    temperature=0.3,
                    google_api_key=os.getenv("GOOGLE_API_KEY")
                )
                print("✅ Gemini Pro model ready")
            except Exception as e:
                print(f"❌ Gemini Pro not available: {e}")
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
                return

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
            'contact', 'email', 'github', 'phone', 'number', 'summary', 'about',
            'what is', 'tell me about', 'can you', 'could you', 'explain',
            'describe', 'how', 'what are', 'where', 'when'
        ]
        
        query_lower = query.lower()
        
        # Exclude social media queries first
        if self.is_social_media_query(query):
            return False
            
        return any(keyword in query_lower for keyword in resume_keywords)

    async def get_general_knowledge_response(self, query: str) -> str:
        """Get response for general knowledge questions"""
        try:
            if not self.llm:
                return f"I can provide general information about '{query}'. For detailed information, please check reliable sources."
            
            prompt = f"""You are Sandip Assistance. Work as a Alexa or google assistant. If user ask any general Question then show answer in 2-3 sentence only.
            
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
            return "Ask me about specific topics like my experience, skills, projects, or contact information."

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

    async def get_response(self, message: str, session_id: str = None, use_voice: bool = False) -> Dict[str, Any]:
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            print(f"💬 Processing query: '{message}'")
            print(f"🎤 Voice input: {use_voice}")
            
            cleaned_message = message.strip().lower()
            
            # Handle greetings
            if cleaned_message in ['hi', 'hello', 'hey']:
                response_text = "Hello! I'm Sandip's AI assistant. What can I help you learn about Sandip today?"
                audio_base64 = self.text_to_speech_base64(response_text) if use_voice else ""
                sources = ["greeting"]
                
            # Handle social media requests - ONLY if explicitly requested
            elif self.is_social_media_query(cleaned_message):
                print("🔗 Handling social media request...")
                result = self.handle_social_media_request(message)
                return {
                    "response": result["response"],
                    "audio": result.get("audio", "") if use_voice else "",
                    "session_id": session_id,
                    "sources": result["sources"],
                    "action": result.get("action"),
                    "url": result.get("url"),
                    "platform": result.get("platform")
                }
                
            # Handle resume-related queries (this should catch "explain his experience")
            elif self.is_resume_related_query(cleaned_message):
                print("🔍 Searching in resume...")
                context, sources = self.search_in_resume(message)
                
                if context:
                    # Direct responses for specific queries without LLM
                    if any(word in cleaned_message for word in ['github', 'git']):
                        response_text = "You can find my GitHub profile at: github.com/sandipbaste\nWould you like me to open it for you?"
                        audio_base64 = self.text_to_speech_base64(response_text) if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['email']):
                        response_text = "You can reach me at: sandipbaste999@gmail.com"
                        audio_base64 = self.text_to_speech_base64(response_text) if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['phone', 'number', 'contact']):
                        if 'email' not in cleaned_message:
                            response_text = "My contact number is: +91 9767952471"
                            audio_base64 = self.text_to_speech_base64("My contact number is plus ninety one ninety seven sixty seven ninety five twenty four seventy one") if use_voice else ""
                        else:
                            response_text = "My contact information:\nEmail: sandipbaste999@gmail.com\nPhone: +91 9767952471\nGitHub: github.com/sandipbaste\nLinkedIn: linkedin.com/in/sandipbaste999"
                            audio_base64 = self.text_to_speech_base64("My contact information includes email, phone, GitHub, and LinkedIn profiles.") if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['project']):
                        response_text = self.format_projects_response(context)
                        audio_base64 = self.text_to_speech_base64("I have worked on several AI projects including WhatsApp chatbot, voice assistant, and video insight extractor.") if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['skill']):
                        response_text = self.extract_skills_response(context)
                        audio_base64 = self.text_to_speech_base64("My skills include Python, Generative AI, Large Language Models, and various AI frameworks.") if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['experience', 'work', 'job', 'career']):
                        response_text = self.extract_experience_response(context)
                        audio_base64 = self.text_to_speech_base64("I worked as an AI/ML Developer Intern at Application Square Infotech, where I developed chatbot and voicebot applications.") if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['education']):
                        response_text = self.extract_education_response(context)
                        audio_base64 = self.text_to_speech_base64("I'm pursuing Master's in Computer Science with a CGPA of seven point nine one, and completed Bachelor's with eight point two seven CGPA.") if use_voice else ""
                    
                    elif any(word in cleaned_message for word in ['summary', 'about', 'who is']):
                        response_text = self.extract_summary_response(context)
                        audio_base64 = self.text_to_speech_base64("I'm Sandip Baste, an AI/ML Developer specializing in Generative AI and Large Language Models. I build intelligent AI solutions.") if use_voice else ""
                    
                    else:
                        # Use LLM for other queries like "explain his experience"
                        response_text = await self.get_llm_response(context, message)
                        audio_base64 = self.text_to_speech_base64(response_text) if use_voice else ""
                else:
                    response_text = "I couldn't find specific information about that in my resume. Please ask about my skills, projects, experience, education, or contact information."
                    audio_base64 = self.text_to_speech_base64("I couldn't find specific information about that. Please ask about my skills, projects, or experience.") if use_voice else ""
                    sources = ["resume_not_found"]
            
            # Handle general knowledge questions
            else:
                print("🌍 Handling general knowledge question...")
                response_text = await self.get_general_knowledge_response(message)
                audio_base64 = self.text_to_speech_base64(response_text) if use_voice else ""
                sources = ["general_knowledge"]
            
            print(f"🤖 Generated response: {response_text}")
            print(f"📚 Sources: {sources}")
            
            return {
                "response": response_text, 
                "audio": audio_base64,
                "session_id": session_id, 
                "sources": sources
            }

        except Exception as e:
            print(f"❌ Error generating response: {e}")
            
            # Simple fallback responses
            if any(greet in cleaned_message for greet in ['hi', 'hello', 'hey']):
                fallback_response = "Hello! I'm Sandip's AI assistant. What can I help you learn about Sandip today?"
                audio_base64 = self.text_to_speech_base64(fallback_response) if use_voice else ""
            elif any(word in cleaned_message for word in ['github']):
                fallback_response = "You can find my GitHub profile at: github.com/sandipbaste\nWould you like me to open it for you?"
                audio_base64 = self.text_to_speech_base64("You can find my GitHub profile at github.com/sandipbaste") if use_voice else ""
            elif any(word in cleaned_message for word in ['email']):
                fallback_response = "You can reach me at: sandipbaste999@gmail.com"
                audio_base64 = self.text_to_speech_base64("You can reach me at sandipbaste999@gmail.com") if use_voice else ""
            elif any(word in cleaned_message for word in ['project']):
                fallback_response = "I have worked on AI projects including WhatsApp Chatbot, Voice Assistant Nora, and Video Insight Extractor."
                audio_base64 = self.text_to_speech_base64("I have worked on AI projects including WhatsApp chatbot, voice assistant, and video insight extractor.") if use_voice else ""
            elif any(word in cleaned_message for word in ['skill']):
                fallback_response = "My skills include Python, Generative AI, LLMs, LangChain, FastAPI, and various AI technologies."
                audio_base64 = self.text_to_speech_base64("My skills include Python, Generative AI, and various AI technologies.") if use_voice else ""
            elif any(word in cleaned_message for word in ['experience']):
                fallback_response = "I worked as an AI/ML Developer Intern at Application Square Infotech, where I developed chatbot and voicebot applications."
                audio_base64 = self.text_to_speech_base64("I worked as an AI/ML Developer Intern at Application Square Infotech.") if use_voice else ""
            else:
                fallback_response = "I'm here to help you learn about Sandip's professional background. Ask about skills, projects, experience, or contact information."
                audio_base64 = self.text_to_speech_base64("I'm here to help you learn about Sandip's professional background.") if use_voice else ""
            
            return {
                "response": fallback_response,
                "audio": audio_base64,
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