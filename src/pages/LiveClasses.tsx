import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, ExternalLink } from 'lucide-react';

const LiveClasses: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const iframeUrl = "https://irsion-10-0-hq44-alphaproject.netlify.app/";

  useEffect(() => {
    // Reset loading state when component mounts
    setIsLoading(true);
    setLoadError(false);
    
    // Set a timeout to handle slow loading
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setLoadError(true);
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(loadTimeout);
  }, [retryCount]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(iframeUrl, '_blank');
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pb-20 md:pb-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ExternalLink className="h-8 w-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">Loading Issue</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            The live classes page is taking longer than expected to load. This might be due to network issues.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Retry Loading</span>
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="w-full bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Open in New Tab</span>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm">
              If the issue persists, try refreshing the page or check your internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-16 md:pb-0">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Loading Live Classes</h2>
            <p className="text-gray-400 mb-4">Please wait while we load the content...</p>
            
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            
            <div className="mt-6 text-xs text-gray-600">
              <p>This may take a few moments on first load</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full h-screen">
        <iframe 
          key={retryCount} // Force reload on retry
          src={iframeUrl}
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="w-full h-full"
          title="Live Classes"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="eager"
          style={{
            border: 'none',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default LiveClasses;