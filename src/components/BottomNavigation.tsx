import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    { 
      path: '/batches', 
      label: 'Batches', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="m22 21-3-3m0 0a5.5 5.5 0 1 0-7.78-7.78 5.5 5.5 0 0 0 7.78 7.78Z"/>
        </svg>
      )
    },
    { 
      path: '/live-classes', 
      label: 'Live', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <polygon points="23 7 16 12 23 17 23 7"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      )
    },
    { 
      path: '/books', 
      label: 'Books', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
      )
    },
    { 
      path: '/chat', 
      label: 'AI Chat', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="11" r="1"/>
          <circle cx="8" cy="11" r="1"/>
          <circle cx="16" cy="11" r="1"/>
        </svg>
      )
    },
  ];

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger chatbot open
    const chatbotButton = document.querySelector('.chatbot-toggle') as HTMLButtonElement;
    if (chatbotButton) {
      chatbotButton.click();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-50 md:hidden shadow-2xl">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isChatItem = item.path === '/chat';
          
          if (isChatItem) {
            return (
              <button
                key={item.path}
                onClick={handleChatClick}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-0 flex-1 relative ${
                  'text-gray-600 hover:text-blue-600 active:scale-95'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 relative ${
                  'hover:bg-blue-50'
                }`}>
                  {item.icon}
                  {/* AI indicator dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                </div>
                <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                  'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-0 flex-1 relative ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 active:scale-95'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-100 shadow-lg transform scale-110' 
                  : 'hover:bg-blue-50'
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white/95"></div>
    </div>
  );
};

export default BottomNavigation;