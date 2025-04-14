import React, { useState, useEffect, useRef } from 'react';
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaSun,
  FaMoon,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaArrowDown,
  FaPlus
} from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import axios from 'axios';
import './App.css';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  isEdited?: boolean;
};

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Explain quantum computing in simple terms",
    "What's the difference between React and Vue?",
    "Suggest a good book about AI",
    "How to improve my coding skills?"
   
  ];

  // Initialize with dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Apply dark/light mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Check if scroll arrow should be shown
  useEffect(() => {
    const checkScrollPosition = () => {
      if (!chatContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 20;
      setShowScrollArrow(!isAtBottom && scrollHeight > clientHeight);
    };

    checkScrollPosition();

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', checkScrollPosition);
      return () => chatContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      scrollToBottom();
    }
  }, [chatHistory, loading]);

  const generateId = () => Math.random().toString(36).substring(2, 11);

  const simulateTyping = (text: string, callback: () => void) => {
    let i = 0;
    const typingSpeed = 20; // milliseconds per character
    const partialText = text.substring(0, i);

    setChatHistory(prev => [...prev.slice(0, -1), {
      ...prev[prev.length - 1],
      text: partialText
    }]);

    const typingInterval = setInterval(() => {
      i++;
      const partialText = text.substring(0, i);

      setChatHistory(prev => [...prev.slice(0, -1), {
        ...prev[prev.length - 1],
        text: partialText
      }]);

      if (i >= text.length) {
        clearInterval(typingInterval);
        callback();
      }
    }, typingSpeed);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      text: message
    };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:8000/chat', { message });
      const botReply: Message = {
        id: generateId(),
        type: 'bot',
        text: '' // Start with empty text for typing effect
      };

      setChatHistory(prev => [...prev, botReply]);

      // Simulate typing effect for bot response
      simulateTyping(res.data.response, () => {
        setIsTyping(false);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage: Message = {
        id: generateId(),
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.'
      };
      setChatHistory(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    document.getElementById('chat-input')?.focus();
  };

  const clearChat = () => {
    setChatHistory([]);
    setEditingId(null);
  };

  const startNewChat = () => {
    clearChat();
  };

  const startEditing = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = () => {
    if (!editText.trim()) return;

    setChatHistory(prev =>
      prev.map(msg =>
        msg.id === editingId
          ? { ...msg, text: editText, isEdited: true }
          : msg
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const resendMessage = (msg: Message) => {
    setMessage(msg.text);
    document.getElementById('chat-input')?.focus();
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <FaRobot className="logo-icon" />
            <h1>Derek AI</h1>
          </div>
          <div className="header-actions">
            <button
              className="new-chat-button"
              onClick={startNewChat}
              title="Start a new chat"
            >
              <FaPlus />
              <span>New Chat</span>
            </button>
            <button
              className="clear-button"
              onClick={clearChat}
              title="Clear conversation"
            >
              <FaTrash />
            </button>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </header>

      <main className="chat-main">
        {chatHistory.length === 0 ? (
          <div className="welcome-section">
            <div className="welcome-content">
              <div className="welcome-icon">
                <IoSparkles />
              </div>
              <h2>How can I help you today?</h2>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-card animate__animated animate__fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-history-container">
            <div className="chat-history" ref={chatContainerRef}>
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-container ${msg.type} animate__animated animate__fadeInUp`}
                >
                  <div className="message-avatar">
                    {msg.type === 'bot' ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className="message-content">
                    {editingId === msg.id ? (
                      <div className="edit-container">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-textarea"
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button
                            className="edit-save"
                            onClick={saveEdit}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="edit-cancel"
                            onClick={cancelEditing}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="message-text">
                          {msg.text.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                          {msg.isEdited && (
                            <span className="edited-badge">(edited)</span>
                          )}
                        </div>
                        {msg.type === 'user' && (
                          <div className="message-actions">
                            <button
                              className="action-button"
                              onClick={() => startEditing(msg)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-button"
                              onClick={() => resendMessage(msg)}
                              title="Resend"
                            >
                              <FaPaperPlane />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {(loading || isTyping) && (
                <div className="message-container bot">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showScrollArrow && (
              <button
                className="scroll-down-button"
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
              >
                <FaArrowDown />
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="chat-footer">
        <div className="input-container">
          <input
            id="chat-input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="chat-input"
            placeholder="Message Derek AI..."
            autoFocus
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="send-button"
            disabled={!message.trim() || loading}
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className="footer-note">
          Derek AI can make mistakes. Consider checking important information.
        </div>
      </footer>
    </div>
  );
};

export default App;