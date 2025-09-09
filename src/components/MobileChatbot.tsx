import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Smile, ArrowUp, Bot } from 'lucide-react';

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

interface MobileChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileChatbot: React.FC<MobileChatbotProps> = ({ isOpen, onClose }) => {
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

  // API Configuration
  const API_KEY = "AIzaSyC5AvYpkdw1S4o0UJUXJMI_Ehb0-EtfLkU";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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

    if (file.size > 4 * 1024 * 1024) {
      alert('File size should be less than 4MB for faster processing');
      return;
    }

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
      const systemPrompt = `You are Suraj Bhai, a caring AI tutor. Respond in natural Hinglish (Hindi words in English letters). Be helpful, caring, and concise. Keep responses under 200 words for faster delivery.`;
      
      const userParts: any[] = [{ text: `${systemPrompt}\n\nUser query: ${userMessage}` }];
      
      if (fileData) {
        userParts.push({ inline_data: fileData });
      }

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
            maxOutputTokens: 300,
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

      const botResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .trim();

      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text: botResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      setChatHistory(prev => [
        ...prev.slice(-3),
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
    if (isLoading) return;

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
    setIsLoading(true);

    let fileData: { data: string; mime_type: string } | undefined;
    if (selectedFile && filePreview) {
      const base64Data = filePreview.split(',')[1];
      fileData = {
        data: base64Data,
        mime_type: selectedFile.type
      };
    }

    const messageText = inputMessage.trim();
    setInputMessage('');
    removeFile();

    setTimeout(() => {
      generateBotResponse(messageText, fileData);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-[9999] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex items-center justify-between safe-area-top">
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
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Body */}
      <div 
        ref={chatBodyRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900"
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
      <div className="p-4 bg-gray-800 border-t border-gray-700 safe-area-bottom">
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MobileChatbot;