import React from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js featuring AI-powered recommendations and seamless checkout experience.",
      tech: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      link: "#"
    },
    {
      id: 2,
      title: "AI Chat Application",
      description: "Real-time chat application with AI integration using Gemini API and WebSocket connections for instant messaging.",
      tech: ["React", "FastAPI", "WebSockets", "Gemini AI", "Docker"],
      link: "#"
    },
    {
      id: 3,
      title: "Data Analytics Dashboard",
      description: "Interactive dashboard for data visualization with real-time metrics and customizable reporting features.",
      tech: ["React", "D3.js", "Python", "PostgreSQL", "FastAPI"],
      link: "#"
    }
  ];

  const skills = [
    "UI/UX Design", "Figma", "Prototyping", "User Research", "Wireframing",
    "React", "JavaScript", "TypeScript", "Tailwind CSS", "Python",
    "FastAPI", "MongoDB", "PostgreSQL", "Docker", "AWS"
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">Madelyn Torff</div>
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
              <div className="text-sm font-semibold text-primary-600 mb-4 uppercase tracking-wide">UI/UX DESIGNER & DEVELOPER</div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Hello, my name is <span className="text-primary-600">Madelyn Torff</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                I create beautiful, functional digital experiences that users love. 
                With 5+ years in UI/UX design and full-stack development, I bridge the gap between design and technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg">
                  View Projects <ExternalLink size={18} />
                </button>
                <button className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2">
                  <Linkedin size={18} /> LinkedIn
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-1 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white rounded-xl p-6 shadow-inner">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-3xl font-bold text-primary-600">MT</span>
                      </div>
                      <p className="text-gray-500 font-medium">Madelyn Torff</p>
                      <p className="text-sm text-gray-400">UI/UX Designer</p>
                    </div>
                  </div>
                </div>
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
                I'm a passionate UI/UX designer and full-stack developer with over 5 years of experience 
                creating digital products that users love. My background in both design and development 
                allows me to create seamless, efficient, and beautiful user experiences.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I believe in the power of user-centered design and data-driven decisions. 
                Every pixel and line of code serves a purpose in creating meaningful interactions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What I Do</h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  User Interface Design & Prototyping
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  User Experience Research & Testing
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  Full-Stack Web Development
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  AI Integration & Chatbot Development
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
                <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors flex items-center gap-2">
                  View Case Study <ExternalLink size={16} />
                </button>
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
            <a href="#" className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300">
              <Linkedin size={24} />
            </a>
            <a href="#" className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300">
              <Github size={24} />
            </a>
            <a href="#" className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg transform hover:-translate-y-1 duration-300">
              <Mail size={24} />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-gray-600 mb-6">
              Interested in working together? Let's talk about your project!
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors w-full">
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © 2024 Madelyn Torff. All rights reserved. Built with React & FastAPI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;