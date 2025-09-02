import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, Smile, ArrowUp, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  attachment?: {
    data: string;
    mimeType: string;
  };
}

interface ChatHistory {
  role: 'user' | 'model';
  parts: Array<{ text?: string; inline_data?: { data: string; mime_type: string } }>;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Namaste! Main Suraj Bhai hun 🙏\n\nHaan bolo, main aapki kaise help kar sakta hun? Main hamesha aapke liye ready hun!\n\n📚 Studies mein koi bhi doubt ho\n🔍 Koi bhi problem solve karni ho\n📝 Study tips chahiye hon\n💡 Koi bhi question ho\n\nAap ek baar apni problem ya issue ko bata kar to dekho, main puri koshish karunga aapki help karne ki!\n\nAchha aur batao, studies kaise chal rahi hai? 😊',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Optimized API Configuration with faster model
  const API_KEY = "AIzaSyC5AvYpkdw1S4o0UJUXJMI_Ehb0-EtfLkU";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Simplified chat history for faster responses
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 4MB for faster processing)
    if (file.size > 4 * 1024 * 1024) {
      alert('File size should be less than 4MB for faster processing');
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Kripya sirf image files upload karein / Please upload only image files');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateBotResponse = async (userMessage: string, fileData?: { data: string; mime_type: string }) => {
    try {
      // Optimized prompt for faster responses
      const systemPrompt = `You are Suraj Bhai, a caring AI tutor. Respond in natural Hinglish (Hindi words in English letters). Be helpful, caring, and concise. Keep responses under 200 words for faster delivery.`;
      
      // Prepare user message for API with optimized structure
      const userParts: any[] = [{ text: `${systemPrompt}\n\nUser query: ${userMessage}` }];
      
      if (fileData) {
        userParts.push({ inline_data: fileData });
      }

      // Use only recent chat history (last 4 messages) for faster processing
      const recentHistory = chatHistory.slice(-4);
      const requestHistory = [
        ...recentHistory,
        {
          role: "user" as const,
          parts: userParts
        }
      ];

      const requestOptions = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          contents: requestHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300, // Limit for faster responses
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      };

      // Set timeout for API request (10 seconds max)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_URL, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid API response format');
      }

      // Extract bot response
      const botResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim();

      // Add bot response to messages
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Update chat history (keep only recent messages)
      setChatHistory(prev => [
        ...prev.slice(-3), // Keep only last 3 exchanges
        {
          role: "user",
          parts: [{ text: userMessage }]
        },
        {
          role: "model",
          parts: [{ text: botResponseText }]
        }
      ]);

    } catch (error) {
      console.error('Error generating bot response:', error);
      
      let errorText = 'Are yaar, mujhe kuch technical problem ho rahi hai 😅\n\nKoi baat nahi, aap phir se try kariye. Main yahi hun aapki help ke liye! 🙏';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorText = 'Response time zyada ho gaya, phir se try kariye! 🔄\n\nMain jaldi jawab dene ki koshish kar raha hun.';
        } else if (error.message.includes('API Error')) {
          errorText = 'API mein kuch issue hai, thoda wait karke phir try kariye! ⏳';
        }
      }
      
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: errorText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() && !selectedFile) return;
    if (isLoading) return; // Prevent multiple requests

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
      attachment: selectedFile ? {
        data: filePreview!,
        mimeType: selectedFile.type
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator immediately
    setIsLoading(true);

    // Prepare file data for API if exists
    let fileData: { data: string; mime_type: string } | undefined;
    if (selectedFile && filePreview) {
      const base64Data = filePreview.split(',')[1];
      fileData = {
        data: base64Data,
        mime_type: selectedFile.type
      };
    }

    // Clear input and file immediately
    const messageText = inputMessage.trim();
    setInputMessage('');
    removeFile();

    // Generate bot response with minimal delay
    setTimeout(() => {
      generateBotResponse(messageText, fileData);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const commonEmojis = ['😊', '👍', '🙏', '📚', '🤔', '💡', '✨', '🎯', '📝', '🔥'];

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 ${isOpen ? 'z-30' : 'z-50'} w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group chatbot-pulse ${
          isOpen ? 'rotate-90' : ''
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            {!isOpen && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Suraj Bhai se baat karein
              </div>
            )}
            <img 
              src="https://ik.imagekit.io/mboz1omen/7e3b3b37-d7c2-40dc-aff6-de118c02ecea.png?updatedAt=1752907052411"
              alt="Suraj Bhai AI Assistant"
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallbackIcon = document.createElement('div');
                  fallbackIcon.innerHTML = '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.681L3 21l2.681-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path></svg>';
                  parent.appendChild(fallbackIcon);
                }
              }}
            />
          </>
        )}
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-700 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-10rem)] md:max-w-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Suraj Bhai</h3>
                <p className="text-xs text-white/80">AI Tutor • Always Ready</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div 
            ref={chatBodyRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900 min-h-0"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                  {!message.isUser && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-400">Suraj Bhai</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl p-3 ${
                      message.isUser
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-md'
                        : 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'
                    }`}
                  >
                    {message.attachment && (
                      <img
                        src={message.attachment.data}
                        alt="Attachment"
                        className="w-full max-w-48 rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                  
                  <div className={`text-xs text-gray-400 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Optimized Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">Suraj Bhai is thinking...</span>
                  </div>
                  <div className="bg-gray-800 rounded-2xl rounded-bl-md p-4 border border-gray-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Footer */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            {/* File Preview */}
            {filePreview && (
              <div className="mb-3 relative inline-block p-1 bg-gray-700/50 rounded-xl border border-gray-600/50">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <button
                  onClick={removeFile}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 shadow-md hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-3 p-4 bg-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 shadow-lg">
                <div className="flex flex-wrap gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      className="w-9 h-9 hover:bg-gray-600/50 rounded-xl transition-all duration-200 flex items-center justify-center text-lg hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Koi bhi baat karein, sawal puchiye..."
                  className="w-full px-4 py-3 pr-20 bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 text-gray-100 placeholder-gray-400 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/50 focus:bg-gray-700 max-h-32 text-sm leading-relaxed transition-all duration-200 shadow-inner"
                  rows={1}
                  disabled={isLoading}
                />
                
                {/* Input Controls */}
                <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-7 h-7 text-gray-400 hover:text-orange-400 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Smile className="h-4 w-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-7 h-7 text-gray-400 hover:text-orange-400 hover:bg-gray-600/50 rounded-lg flex items-center justify-center transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
                className="w-11 h-11 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            </form>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .fixed.bottom-24.right-6 {
            position: fixed !important;
            top: 4rem !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 5rem !important;
            width: 100% !important;
            height: calc(100vh - 9rem) !important;
            border-radius: 0 !important;
            max-width: none !important;
            max-height: none !important;
            z-index: 9999 !important;
          }
        }
        
        @media (max-width: 1024px) and (min-width: 641px) {
          .fixed.bottom-24.right-6 {
            bottom: 6rem !important;
            right: 1rem !important;
            max-height: calc(100vh - 12rem) !important;
            z-index: 9999 !important;
          }
        }
        
        @media (max-height: 700px) and (min-width: 641px) {
          .fixed.bottom-24.right-6 {
            height: calc(100vh - 8rem) !important;
            max-height: calc(100vh - 8rem) !important;
            bottom: 2rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;