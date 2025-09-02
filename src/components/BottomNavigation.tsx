import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Video, BookOpen } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/batches', label: 'Batches', icon: Users },
    { path: '/live-classes', label: 'Live', icon: Video },
    { path: '/books', label: 'Books', icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-blue-500/20' : 'hover:bg-gray-700/50'
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : ''}`} />
              </div>
              <span className={`text-xs font-medium mt-1 truncate ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;