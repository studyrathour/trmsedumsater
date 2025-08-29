import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TelegramPopup from './components/TelegramPopup';
import LoadingSpinner from './components/LoadingSpinner';
import DevToolsProtection from './components/DevToolsProtection';
import IframePreloader from './components/IframePreloader';
import Home from './pages/Home';
import LiveClasses from './pages/LiveClasses';
import Books from './pages/Books';
import Batches from './pages/Batches';
import AIChatbot from './components/AIChatbot/AIChatbot';

const AppContent: React.FC = () => {
  const { loading } = useApp();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 scrollbar-dark select-none">
        <DevToolsProtection />
        <IframePreloader />
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
            </>
          } />
          
          <Route path="/batches" element={
            <>
              <Header />
              <Batches />
            </>
          } />
          
          <Route path="/live-classes" element={
            <>
              <Header />
              <LiveClasses />
            </>
          } />
          
          <Route path="/books" element={
            <>
              <Header />
              <Books />
            </>
          } />
          
          {/* Catch all route for 404 - redirect to home */}
          <Route path="*" element={
            <>
              <Header />
              <Home />
            </>
          } />
        </Routes>
        
        <TelegramPopup />
        <AIChatbot />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;