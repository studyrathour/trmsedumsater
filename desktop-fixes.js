// Desktop Application JavaScript Fixes

(function() {
  'use strict';

  // Detect if running in desktop app
  const isDesktopApp = () => {
    return window.navigator.userAgent.includes('Electron') || 
           window.process?.versions?.electron ||
           window.location.protocol === 'file:' ||
           window.navigator.userAgent.includes('EduMaster');
  };

  // Fix for white screen issue
  const fixWhiteScreen = () => {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixWhiteScreen);
      return;
    }

    // Force render by triggering a reflow
    const root = document.getElementById('root');
    if (root) {
      root.style.display = 'none';
      root.offsetHeight; // Trigger reflow
      root.style.display = '';
    }

    // Add desktop app class to body
    document.body.classList.add('desktop-app');
  };

  // Fix external links for desktop app
  const fixExternalLinks = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.target === '_blank') {
        e.preventDefault();
        
        // Try to use Electron's shell if available
        if (window.require) {
          try {
            const { shell } = window.require('electron');
            shell.openExternal(link.href);
          } catch (error) {
            // Fallback to window.open
            window.open(link.href, '_blank');
          }
        } else {
          window.open(link.href, '_blank');
        }
      }
    });
  };

  // Fix iframe loading issues
  const fixIframes = () => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      // Add load event listener
      iframe.addEventListener('load', () => {
        console.log('Iframe loaded successfully:', iframe.src);
      });

      // Add error event listener
      iframe.addEventListener('error', (e) => {
        console.error('Iframe failed to load:', iframe.src, e);
        
        // Try to reload iframe after a delay
        setTimeout(() => {
          const currentSrc = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = currentSrc;
          }, 100);
        }, 2000);
      });

      // Set proper attributes for desktop app
      iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-presentation');
      iframe.setAttribute('loading', 'eager');
    });
  };

  // Fix popup overlays
  const fixPopupOverlays = () => {
    // Override popup behavior for desktop app
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
      // Reduce overlay timeout for desktop app
      if (isDesktopApp() && delay > 5000) {
        delay = Math.min(delay, 2000);
      }
      return originalSetTimeout.call(this, callback, delay, ...args);
    };
  };

  // Fix Firebase connection for desktop app
  const fixFirebaseConnection = () => {
    // Add CORS headers for desktop app
    if (isDesktopApp()) {
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        // Add headers for Firebase requests
        if (typeof url === 'string' && url.includes('firestore.googleapis.com')) {
          options.headers = {
            ...options.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          };
        }
        return originalFetch.call(this, url, options);
      };
    }
  };

  // Fix CSS animations and transitions
  const fixAnimations = () => {
    // Ensure CSS animations work properly
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  };

  // Initialize fixes when DOM is ready
  const initializeFixes = () => {
    if (!isDesktopApp()) return;

    console.log('Initializing desktop app fixes...');
    
    fixWhiteScreen();
    fixExternalLinks();
    fixPopupOverlays();
    fixFirebaseConnection();
    fixAnimations();
    
    // Fix iframes after a short delay
    setTimeout(fixIframes, 1000);
    
    // Monitor for dynamically added iframes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IFRAME') {
              fixIframes();
            } else if (node.querySelectorAll) {
              const iframes = node.querySelectorAll('iframe');
              if (iframes.length > 0) {
                fixIframes();
              }
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('Desktop app fixes initialized successfully');
  };

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixes);
  } else {
    initializeFixes();
  }

  // Add global error handler
  window.addEventListener('error', (e) => {
    console.error('Desktop app error:', e.error);
  });

  // Add unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Desktop app unhandled promise rejection:', e.reason);
  });

})();