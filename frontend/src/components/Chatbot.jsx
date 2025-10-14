import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const autoCloseTimerRef = useRef(null);
  const autoOpenTimerRef = useRef(null);

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

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage);
      
      const botMessage = { 
        text: response.response, 
        sender: 'bot',
        sources: response.sources
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: "Sorry, I'm having trouble responding right now. Please make sure the backend server is running.", 
        sender: 'bot' 
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

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Sandip's Assistant</h3>
                  <p className="text-primary-100 text-sm">Ask me about MySelf!</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-primary-100 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot size={48} className="mx-auto mb-4 text-primary-300" />
                <p className="font-medium text-gray-700">Hello! I'm Sandip's AI assistant.</p>
                <p className="text-sm mt-2">Ask me about her experience, skills, projects, or anything !</p>
                <div className="mt-6 space-y-2 text-left">
                  <p className="text-xs text-gray-500">Try asking:</p>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setInputMessage("What is Sandip's experience?")}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-primary-300 transition-colors block w-full text-left"
                    >
                      "What is Sandip's experience?"
                    </button>
                    <button 
                      onClick={() => setInputMessage("Tell me about her skills")}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-primary-300 transition-colors block w-full text-left"
                    >
                      "Tell me about her skills"
                    </button>
                    <button 
                      onClick={() => setInputMessage("What projects has she worked on?")}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-primary-300 transition-colors block w-full text-left"
                    >
                      "What projects has she worked on?"
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'bot' ? (
                        <Bot size={16} className="text-primary-600" />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                      <span className="text-xs font-medium opacity-75">
                        {message.sender === 'bot' ? 'Assistant' : 'You'}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Sources: {message.sources.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot size={16} className="text-primary-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Sandip's experience..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;