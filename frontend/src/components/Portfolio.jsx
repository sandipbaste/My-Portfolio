import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, MessageCircle, Instagram, Facebook, Mail, ExternalLink, X, Code, Briefcase, Phone, BookOpen, User, Home, Send, MapPin, Menu } from 'lucide-react';
import myphoto from '../assets/my photo 1.jpg';

// Fixed ContactModal component - moved outside to prevent re-renders
const ContactModal = ({ isOpen, onClose, formData, onInputChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative text-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto border border-white"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-red-700 rounded-full transition-colors duration-200"
            >
              <X size={18} className="text-gray-300 hover:text-white" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-4 space-y-3">
            <div>
              <label htmlFor="modal-name" className="block text-xs font-medium text-gray-200 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="modal-name"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 bg-transparent text-white border border-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-200 text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="modal-email" className="block text-xs font-medium text-gray-200 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="modal-email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                required
                className="w-full px-3 py-2 bg-transparent text-white border border-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-200 text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="modal-message" className="block text-xs font-medium text-gray-200 mb-1">
                Message
              </label>
              <textarea
                id="modal-message"
                name="message"
                value={formData.message}
                onChange={onInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 bg-transparent text-white border border-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-200 resize-none text-sm"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <div className="flex space-x-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-3 py-2 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg text-sm"
              >
                Send
              </button>
            </div>
          </form>

          <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-b-2xl border-t border-gray-700">
            <p className="text-xs text-gray-300 text-center">
              Or email me directly at{" "}
              <a 
                href="mailto:sandipbaste999@gmail.com"
                className="text-white hover:text-green-500 font-medium"
              >
                sandipbaste999@gmail.com
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [typedName, setTypedName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const fullName = "Sandip Baste";

  useEffect(() => {
    if (typedName.length < fullName.length) {
      const timer = setTimeout(() => {
        setTypedName(fullName.slice(0, typedName.length + 1));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [typedName]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: 1,
      title: "WhatsApp Chatbot",
      description: "AI-powered WhatsApp chatbot with Python, Gemini API, PyAutoGUI, and Pyperclip, enabling automated, human-like, and context-aware conversations, enhancing user engagement by 95% through real-time, natural interactions with typing effects and loop-prevention.",
      tech: ["Python", "LLM", "PyAutoGUI", "Pyperclip"],
      link: "https://github.com/sandipbaste/WhatsApp-AI-Chatbot",
      icon: "🤖"
    },
    {
      id: 2,
      title: "Nora - AI Voice Assistance",
      description: "AI-powered voice assistant with Python, Gemini API, SpeechRecognition, pyttsx3, ReactJS, and Tailwind CSS, featuring context-aware dialogue, voice input via SpeechRecognition, TTS output with pyttsx3, and real-time features like web search, music playback, and news updates for multi-command task automation.",
      tech: ["Python", "React", "LLM", "gTTS/pyttsx3", "Speech Recognition", "Pygame", "NewsAPI", "Web-browser"],
      link: "https://rescruitment-process-for-ev-power.netlify.app/",
      icon: "🎤"
    },
    {
      id: 3,
      title: "Video Insighter",
      description: "Video insight system with Python, FFmpeg, Faster-Whisper, FastAPI, and Gemini API, extracting audio via FFmpeg, transcribing with Faster-Whisper, and processing queries through a FastAPI backend, enabling quick retrieval of context-specific insights from large video files, improving accessibility.",
      tech: ["Python", "LangChain", "FastAPI", "LLM", "Chanlit", "FFmpeg", "Whisper"],
      link: "https://github.com/sandipbaste/Video-Insight-Extractor-",
      icon: "🎥"
    }
  ];

  const skills = [
    "Python", "LangChain", "LangGraph", "FastAPI", "RAG", "Agentic AI", 
    "NLP", "ReactJS", "Tailwind CSS", "MongoDB", "MySQL", "Docker", 
    "AWS", "Git", "GitHub", "LLM", "OpenAI", "Gemini", "Hugging Face",
    "Vector Databases", "Chroma", "FAISS", "Speech Recognition", "TTS",
    "REST APIs", "NumPy", "Pandas", "Dialogflow CX"
  ];

  const education = [
    {
      degree: "M.Sc. (Computer Science)",
      institution: "K.K. Wagh Art's, Science and Commerce College Pimpalgaon (B)",
      location: "Nashik, Maharashtra",
      period: "August 2023 – June 2025",
      cgpa: "CGPA: 7.91"
    },
    {
      degree: "B.Sc. (Computer Science)",
      institution: "K.K. Wagh Art's, Science and Commerce College Pimpalgaon (B)",
      location: "Nashik, Maharashtra",
      period: "August 2020 – July 2023",
      cgpa: "CGPA: 8.27"
    }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    setIsModalOpen(false);
    alert('Thank you for your message! I will get back to you soon.');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const SkillBubble = ({ skill, index }) => {
    const colors = [
      'bg-blue-300 text-blue-800 border-blue-400',
      'bg-purple-300 text-purple-800 border-purple-400',
      'bg-green-300 text-green-800 border-green-400',
      'bg-yellow-300 text-yellow-800 border-yellow-400',
      'bg-red-300 text-red-800 border-red-400',
      'bg-pink-300 text-pink-800 border-pink-400',
      'bg-indigo-300 text-indigo-800 border-indigo-400',
      'bg-teal-300 text-teal-800 border-teal-400',
      'bg-orange-300 text-orange-800 border-orange-400',
      'bg-cyan-300 text-cyan-800 border-cyan-400'
    ];

    const colorClass = colors[index % colors.length];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: index * 0.05 
        }}
        className={`px-4 py-2 rounded-full border-2 ${colorClass} font-medium text-sm transition-all duration-300 hover:shadow-lg cursor-default`}
      >
        {skill}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-10 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-md border-b border-gray-700' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Sandip Baste
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-4 xl:space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm xl:text-base ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tablet Navigation (Icons only) */}
            <div className="hidden md:flex lg:hidden space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button and Hire Me */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Get In Touch Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg text-sm"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Get In Touch</span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                <div className="py-2 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Hero Section */}
        <section id="home" className="min-h-screen px-4 sm:px-6 flex items-center relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="text-xs sm:text-sm font-semibold text-blue-400 mb-3 sm:mb-4 uppercase tracking-wide">AI/ML DEVELOPER</div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                  Hello, my name is{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    {typedName.split('').map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-yellow-400"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  I build agentic AI solutions like chatbots, voice bots, and AI agents that make interactions smarter and more natural.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/sandipbaste"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg text-sm sm:text-base"
                  >
                    View Projects <ExternalLink size={16} />
                  </motion.a>

                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href='https://www.linkedin.com/in/sandipbaste999'
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-blue-600 text-blue-400 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-600/10 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </motion.a>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-center text-center space-y-3 order-first lg:order-last"
              >
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 p-[3px] group">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={myphoto}
                    alt="Sandip Baste"
                    className="w-full h-full object-cover rounded-full transition-transform duration-700"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg sm:text-xl">Sandip Baste</h3>
                  <p className="text-gray-400 text-sm sm:text-base">AI/ML Developer</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-black"
            >
              About Me
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 text-black">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">My Journey</h3>
                <p className="mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base text-black">
                  I'm a passionate AI/ML developer with a strong specialization in Generative AI and Large Language Models, honed through my Master's in Computer Science and hands-on internship experience. My background in building intelligent chatbots, voice assistants, and video insight systems allows me to create scalable, real-time AI solutions that enhance user engagement and efficiency.
                </p>
                <p className="leading-relaxed text-sm sm:text-base text-black">
                  I believe in the power of context-aware interactions and data-driven pipelines. Every embedding, retriever, and API integration serves a purpose in delivering accurate and meaningful AI experiences.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-yellow-400">What I Do</h3>
                <ul className="text-black space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    AI-Powered Chatbot Development
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Voice Assistant Integration
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Real-Time API Backend Development
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    Video Insight Extraction Systems
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
            >
              Education Journey
            </motion.h2>
            <div className="space-y-6 sm:space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{edu.degree}</h3>
                      <p className="text-gray-300 mb-1 text-sm sm:text-base">{edu.institution}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">{edu.location}</p>
                    </div>
                    <div className="mt-3 md:mt-0 md:text-right">
                      <p className="text-blue-400 font-semibold text-sm sm:text-base">{edu.period}</p>
                      <p className="text-gray-300 text-sm sm:text-base">{edu.cgpa}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white text-black">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Skills & Technologies
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-center mb-8 sm:mb-12 max-w-2xl mx-auto text-black"
            >
              Technologies I use to bring ideas to life
            </motion.p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {skills.map((skill, index) => (
                <SkillBubble key={skill} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-yellow-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto"
            >
              Here are some of my recent projects that showcase my skills and experience.
            </motion.p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-white text-black rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600/20 rounded-xl mb-3 sm:mb-4 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors text-xl sm:text-2xl">
                    {project.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{project.title}</h3>
                  <p className="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{project.description}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-blue-600/20 text-blue-700 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:text-blue-500 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    View Project <ExternalLink size={14} />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-black"
            >
              Let's Work Together
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-yellow-400 text-center mb-8 sm:mb-12 max-w-2xl mx-auto"
            >
              Ready to bring your next AI project to life? Let's create something amazing together.
            </motion.p>
            
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-black text-center">Get In Touch</h3>
                
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-black font-bold text-xs sm:text-sm">Email</p>
                      <a href="mailto:sandipbaste999@gmail.com" className="text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base">
                        sandipbaste999@gmail.com
                      </a>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-black font-bold text-xs sm:text-sm">Location</p>
                      <p className="text-gray-700 text-sm sm:text-base">Nashik, Maharashtra, India</p>
                    </div>
                  </motion.div>
                </div>

                <div className="flex space-x-3 sm:space-x-4 pt-4 sm:pt-6 justify-center">
                  <motion.a 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.linkedin.com/in/sandipbaste999" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-lg flex items-center justify-center"
                  >
                    <Linkedin size={20} />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://github.com/sandipbaste" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-lg flex items-center justify-center"
                  >
                    <Github size={20} />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://wa.me/919767952471"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors shadow-lg flex items-center justify-center"
                  >
                    <MessageCircle size={20} />
                  </motion.a>
                 <motion.a 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://instagram.com/your_instagram_handle" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-colors shadow-lg flex items-center justify-center"
                  >
                    <Instagram size={20} />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://facebook.com/your_facebook_profile" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-gray-800 border border-gray-300 rounded-xl hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-lg flex items-center justify-center"
                  >
                    <Facebook size={20} />
                  </motion.a>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-300"
              >
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-black">Send me a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 resize-none text-sm sm:text-base"
                      placeholder="Tell me about your project or just say hello!"
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Send size={18} />
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-gray-700 py-8 sm:py-12 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                  Sandip Baste
                </h3>
                <p className="text-white text-sm sm:text-base">
                  AI/ML Developer specializing in Generative AI and LLM solutions.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 sm:space-x-6">
                <motion.a 
                  whileHover={{ scale: 1.2, y: -2 }}
                  href="https://www.linkedin.com/in/sandipbaste999" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2, y: -2 }}
                  href="https://github.com/sandipbaste" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.2, y: -2 }}
                  href="mailto:sandipbaste999@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail size={20} />
                </motion.a>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm sm:text-base">
                  © 2024 Sandip Baste. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Contact Form Modal - Fixed version */}
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Portfolio;