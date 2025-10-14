import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Clock } from 'lucide-react';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const autoCloseTimerRef = useRef(null);
  const autoOpenTimerRef = useRef(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto open after 3 seconds
    autoOpenTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => {
      clearTimeout(autoOpenTimerRef.current);
      clearTimeout(autoCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Reset auto-close timer when user interacts
    if (isOpen) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = setTimeout(() => {
        if (messages.length === 0) {
          setIsOpen(false);
        }
      }, 10000);
    }

    return () => clearTimeout(autoCloseTimerRef.current);
  }, [isOpen, messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { 
      text: inputMessage, 
      sender: 'user',
      timestamp: getCurrentTime()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage);
      
      const botMessage = { 
        text: response.response, 
        sender: 'bot',
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble responding right now. Please make sure the backend server is running.", 
        sender: 'bot',
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Reset timers when manually toggled
    clearTimeout(autoCloseTimerRef.current);
    if (!isOpen) {
      autoCloseTimerRef.current = setTimeout(() => {
        if (messages.length === 0) {
          setIsOpen(false);
        }
      }, 10000);
    }
  };

  const quickQuestions = [
    "What is Sandip's experience?",
    "Tell me about his skills",
    "What projects has he worked on?",
    "What technologies does he use?",
    "How to contact Sandip?"
  ];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: 3.2 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 flex items-center justify-center z-40 border border-gray-600"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed bottom-20 right-6 w-96 h-[600px] bg-[#2A2A2E] text-white rounded-2xl shadow-2xl border border-gray-700 flex flex-col z-[60] overflow-hidden" // Increased z-index to 60
            style={{ top: '80px' }} // Added top positioning to avoid navbar
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Bot size={20} />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="font-semibold"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Sandip's Assistant
                    </motion.h3>
                    <motion.p 
                      className="text-primary-100 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Ask me about MySelf!
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleChat}
                  className="text-white hover:text-primary-100 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {messages.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-gray-300 mt-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                  >
                    <Bot size={48} className="mx-auto mb-4 text-primary-400" />
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-medium text-white mb-2"
                  >
                    Hello! I'm Sandip's AI assistant.
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-300"
                  >
                    Ask me about his experience, skills, projects, or anything!
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 space-y-2 text-left"
                  >
                    <p className="text-xs text-gray-400 mb-3">Try asking:</p>
                    <div className="space-y-2">
                      {quickQuestions.map((question, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInputMessage(question)}
                          className="text-xs bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 hover:border-primary-500 transition-colors block w-full text-left hover:bg-gray-600"
                        >
                          "{question}"
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25 
                    }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-none shadow-lg'
                          : 'bg-gray-700 border border-gray-600 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            {message.sender === 'bot' ? (
                              <Bot size={16} className="text-primary-400" />
                            ) : (
                              <User size={16} className="text-white" />
                            )}
                          </motion.div>
                          <span className={`text-xs font-medium ${message.sender === 'bot' ? 'text-primary-400' : 'text-white'}`}>
                            {message.sender === 'bot' ? 'Assistant' : 'You'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                          <Clock size={12} />
                          <span>{message.timestamp}</span>
                        </div>
                      </div>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="whitespace-pre-wrap text-sm"
                      >
                        {message.text}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700 border border-gray-600 rounded-2xl rounded-bl-none p-4 max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-primary-400" />
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2
                          }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        ></motion.div>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.4
                          }}
                          className="w-2 h-2 bg-primary-400 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-t border-gray-700 bg-[#2A2A2E] rounded-b-2xl"
            >
              <div className="flex space-x-2">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Sandip's experience..."
                  className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ 
                    scale: inputMessage.trim() && !isLoading ? 1.05 : 1,
                  }}
                  whileTap={{ scale: inputMessage.trim() && !isLoading ? 0.95 : 1 }}
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:from-primary-700 hover:to-primary-800"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;