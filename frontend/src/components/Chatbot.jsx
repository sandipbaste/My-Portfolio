import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Clock, Mic, MicOff, Volume2 } from 'lucide-react';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const autoCloseTimerRef = useRef(null);
  const autoOpenTimerRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Generate or get session ID
    let savedSessionId = localStorage.getItem('chat_session_id');
    if (!savedSessionId) {
      savedSessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chat_session_id', savedSessionId);
    }
    setSessionId(savedSessionId);

    // Initialize speech recognition
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('🎤 Speech Recognition not supported in this browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('🎤 Voice recognition started');
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Voice input:', transcript);
      setInputMessage(transcript);
      setIsListening(false);
      
      // Auto-send message after voice input
      setTimeout(() => {
        sendMessage(transcript);
      }, 500);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('🎤 Voice recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition error. Please try again.';
      
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          errorMessage = 'Microphone access is blocked. Please allow microphone permissions in your browser settings.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone connection.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}. Please try typing instead.`;
      }
      
      // Show error message to user
      if (isOpen) {
        setMessages(prev => [...prev, {
          text: errorMessage,
          sender: 'bot',
          timestamp: getCurrentTime()
        }]);
      }
    };

    recognitionRef.current.onend = () => {
      console.log('🎤 Voice recognition ended');
      setIsListening(false);
    };
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('🔊 Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('🔊 Speech synthesis not supported in this browser');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.error('🎤 Speech recognition not initialized');
      return;
    }

    try {
      recognitionRef.current.start();
      // Speak welcome message when mic starts
      speakText("This is Sandip AI Assistance. Start asking any question with me.");
    } catch (error) {
      console.error('🎤 Error starting voice recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

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

  const sendMessage = async (text = null) => {
    const messageToSend = text || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = { 
      text: messageToSend, 
      sender: 'user',
      timestamp: getCurrentTime()
    };
    setMessages(prev => [...prev, userMessage]);
    if (!text) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageToSend, sessionId);
      
      const botMessage = { 
        text: response.response, 
        sender: 'bot',
        timestamp: getCurrentTime()
      };
      setMessages(prev => [...prev, botMessage]);

      // Auto-speak bot responses using GTTS (browser's speech synthesis)
      if (response.response) {
        speakText(response.response);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble responding right now. Please make sure your internet connection is working well.", 
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center z-40 border border-gray-600"
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
            className="fixed bottom-20 right-6 w-96 h-[600px] bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 flex flex-col z-[60] overflow-hidden"
            style={{ top: '80px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
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
                      className="text-blue-100 text-sm"
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
                  className="text-white hover:text-blue-100 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-400 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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
                    <Bot size={48} className="mx-auto mb-4 text-blue-400" />
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
                    className="text-sm text-gray-200"
                  >
                    Ask me about his experience, skills, projects, or anything!
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 space-y-2 text-left"
                  >
                    <p className="text-xs text-white mb-3">Try asking:</p>
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
                          className="text-xs text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-colors block w-full text-left"
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
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none shadow-lg'
                          : 'bg-white border border-gray-300 rounded-bl-none shadow-sm text-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            {message.sender === 'bot' ? (
                              <Bot size={16} className="text-blue-600" />
                            ) : (
                              <User size={16} className="text-white" />
                            )}
                          </motion.div>
                          <span className={`text-xs font-medium ${message.sender === 'bot' ? 'text-blue-600' : 'text-white'}`}>
                            {message.sender === 'bot' ? 'Assistant' : 'You'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
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
                  <div className="bg-white border border-gray-300 rounded-2xl rounded-bl-none p-4 max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-blue-600" />
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
                          className="w-2 h-2 bg-blue-600 rounded-full"
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
                          className="w-2 h-2 bg-blue-600 rounded-full"
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
                          className="w-2 h-2 bg-blue-600 rounded-full"
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
              className="p-4 border-t border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 rounded-b-2xl"
            >
              <div className="flex space-x-2">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Sandip's experience..."
                  className="flex-1 bg-white text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  disabled={isLoading}
                />
                
                {/* Voice Input Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg ${
                    isListening 
                      ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                      : isSpeaking
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-white text-gray-800 hover:bg-gray-800 hover:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isListening ? (
                    <MicOff size={20} />
                  ) : isSpeaking ? (
                    <Volume2 size={20} />
                  ) : (
                    <Mic size={20} />
                  )}
                </motion.button>

                {/* Send Button */}
                <motion.button
                  whileHover={{ 
                    scale: inputMessage.trim() && !isLoading ? 1.05 : 1,
                  }}
                  whileTap={{ scale: inputMessage.trim() && !isLoading ? 0.95 : 1 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-white text-gray-800 p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:bg-gray-800 hover:text-white"
                >
                  <Send size={20} />
                </motion.button>
              </div>

              {/* Voice Status Indicator */}
              {(isListening || isSpeaking) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-white text-sm">
                    {isListening ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 bg-red-500 rounded-full"
                        />
                        <span>Listening... Speak now</span>
                      </>
                    ) : isSpeaking ? (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="w-2 h-2 bg-green-500 rounded-full"
                        />
                        <span>Speaking...</span>
                      </>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;