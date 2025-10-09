import React, { useState } from 'react';
import { Github, Linkedin, Mail, ExternalLink, X } from 'lucide-react';
import myphoto from '../assets/my photo 1.jpg';

const Portfolio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const projects = [
    {
      id: 1,
      title: "WhatsApp Chatbot",
      description: "AI-powered WhatsApp chatbot with Python, Gemini API, PyAutoGUI, and Pyperclip, enabling automated, human-like, and context-aware conversations, enhancing user engagement by 95% through real-time, natural interactions with typing effects and loop-prevention.",
      tech: ["Python", "LLM", "PyAutoGUI", "Pyperclip"],
      link: "https://github.com/sandipbaste/WhatsApp-AI-Chatbot"
    },
    {
      id: 2,
      title: "Nora - AI Voice Assistance",
      description: "AI-powered voice assistant with Python, Gemini API, SpeechRecognition, pyttsx3, ReactJS, and Tailwind CSS, featuring context-aware dialogue, voice input via SpeechRecognition, TTS output with pyttsx3, and real-time features like web search, music playback, and news updates for multi-command task automation.",
      tech: ["Python", "React", "LLM", "gTTS/pyttsx3", "Speech Recongnition", "Pygame", "NewsAPI", "Web-browser"],
      link: "https://rescruitment-process-for-ev-power.netlify.app/"
    },
    {
      id: 3,
      title: "Vedio Insighter",
      description: "Video insight system with Python, FFmpeg, Faster-Whisper, FastAPI, and Gemini API, extracting audio via FFmpeg, transcribing with Faster-Whisper, and processing queries through a FastAPI backend, enabling quick retrieval of context-specific insights from large video files, improving accessibility.",
      tech: ["Python", "LangChain", "FastAPI", "LLM", "Chanlit", "FFmpeg", "Whisper"],
      link: "https://github.com/sandipbaste/Video-Insight-Extractor-"
    }
  ];

  const skills = [
    "Python", "LangChain", "LangGraph", "FastAPI", 
    "RAG", "Agentic AI", "NLP", "ReactJS", "Tailwind CSS", "DLP", "Tools",
     "MongoDB", "MySQL", "Docker", "AWS", "Git", "GitHub",
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
    // Here you can handle form submission, e.g., send to backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    // Close modal
    setIsModalOpen(false);
    // Show success message (you can add a toast notification here)
    alert('Thank you for your message! I will get back to you soon.');
  };

  const ContactModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur effect */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        ></div>
        
        {/* Modal Content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900">Get In Touch</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell me about your project or just say hello!"
              ></textarea>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Or email me directly at{" "}
              <a 
                href="mailto:sandipbaste999@gmail.com"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                sandipbaste999@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">Sandip Baste</div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">About</a>
              <a href="#projects" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Projects</a>
              <a href="#skills" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Skills</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold text-primary-600 mb-4 uppercase tracking-wide">AI/ML DEVELOPER</div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Hello, my name is <span className="text-primary-600">Sandip Baste</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                I build agentic AI solutions like chatbots, voice bots, and AI agents that make interactions smarter and more natural.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/sandipbaste"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                  View Projects <ExternalLink size={18} />
                </a>

                <a 
                  href='https://www.linkedin.com/in/sandipbaste999'
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <Linkedin size={18} /> LinkedIn
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 p-[3px] group">
                <img
                  src={myphoto}
                  alt="Sandip Baste"
                  className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-xl">Sandip Baste</h3>
                <p className="text-gray-500 text-sm">AI/ML Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">My Journey</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                I'm a passionate AI/ML developer with a strong specialization in Generative AI and Large Language Models, honed through my Master's in Computer Science and hands-on internship experience. My background in building intelligent chatbots, voice assistants, and video insight systems allows me to create scalable, real-time AI solutions that enhance user engagement and efficiency.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I believe in the power of context-aware interactions and data-driven pipelines. Every embedding, retriever, and API integration serves a purpose in delivering accurate and meaningful AI experiences.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What I Do</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  AI-Powered Chatbot Development
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  Voice Assistant Integration
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  Real-Time API Backend Development
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  Video Insight Extraction Systems
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Skills & Technologies</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Technologies I use to bring ideas to life
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:border-primary-300 hover:text-primary-600 transition-colors shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-100 rounded-xl mb-4 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <ExternalLink className="text-primary-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-2"
                >
                  View Project <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Connect</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, opportunities, or just a friendly hello.
          </p>
          
          <div className="flex justify-center space-x-6 mb-12">
            <a 
              href="https://www.linkedin.com/in/sandipbaste999" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://github.com/sandipbaste" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300"
            >
              <Github size={24} />
            </a>
            <button
              onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=sandipbaste999@gmail.com", "_blank")}
              className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300 flex items-center justify-center"
            >
              <Mail size={24} />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-gray-600 mb-6">
              Interested in working together? Let's talk about your project!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors w-full"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © 2024 Sandip Baste. All rights reserved. Built with React & FastAPI
          </p>
        </div>
      </footer>

      {/* Contact Form Modal */}
      <ContactModal />
    </div>
  );
};

export default Portfolio;