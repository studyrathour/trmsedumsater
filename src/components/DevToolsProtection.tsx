import React, { useEffect } from 'react';

const DevToolsProtection: React.FC = () => {
  useEffect(() => {
    let devToolsDetected = false;
    let detectionInterval: NodeJS.Timeout;
    let initialLoadComplete = false;

    // Allow initial page load without interference
    const initialLoadTimer = setTimeout(() => {
      initialLoadComplete = true;
    }, 2000);

    // Enhanced website closure function
    const closeWebsiteImmediately = () => {
      if (devToolsDetected) return;
      devToolsDetected = true;

      try {
        // Clear the page content immediately
        document.documentElement.innerHTML = `
          <html>
            <head><title>Access Denied</title></head>
            <body style="background: linear-gradient(135deg, #1f2937, #111827); color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0;">
              <div style="text-align: center; padding: 40px;">
                <div style="font-size: 72px; margin-bottom: 20px;">🚫</div>
                <h1 style="font-size: 32px; margin-bottom: 16px; font-weight: 600;">Access Denied</h1>
                <p style="font-size: 18px; opacity: 0.8; margin-bottom: 30px;">Developer tools detected. Closing...</p>
                <div style="width: 40px; height: 40px; border: 4px solid #374151; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
              </div>
              <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                * { user-select: none !important; -webkit-user-select: none !important; }
              </style>
            </body>
          </html>
        `;

        // Multiple closure attempts
        setTimeout(() => {
          try {
            window.close();
          } catch (e) {
            window.location.href = 'about:blank';
          }
        }, 1000);

        setTimeout(() => {
          try {
            window.location.replace('about:blank');
          } catch (e) {
            window.location.href = 'data:text/html,<h1>Access Denied</h1>';
          }
        }, 2000);

        setTimeout(() => {
          try {
            window.location.reload();
          } catch (e) {
            document.body.innerHTML = '';
          }
        }, 3000);

      } catch (e) {
        try {
          document.body.innerHTML = '<div style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;">🚫 Access Denied</div>';
        } catch (err) {
          // Final fallback
        }
      }
    };

    // Enhanced console detection
    const detectConsoleOpen = () => {
      if (!initialLoadComplete) return false;
      
      let consoleOpen = false;
      const element = document.createElement('div');
      
      Object.defineProperty(element, 'id', {
        get: function() {
          consoleOpen = true;
          return 'detected';
        },
        configurable: true
      });

      try {
        console.log('%c ', element);
        console.clear();
      } catch (e) {
        consoleOpen = true;
      }
      
      return consoleOpen;
    };

    // Enhanced debugger detection
    const detectDebuggerOpen = () => {
      if (!initialLoadComplete) return false;
      
      const start = performance.now();
      try {
        debugger;
      } catch (e) {
        return true;
      }
      const end = performance.now();
      
      return (end - start) > 100;
    };

    // Window size detection
    const detectDevToolsPanel = () => {
      if (!initialLoadComplete) return false;
      
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      return (widthDiff > threshold || heightDiff > threshold) && 
             window.innerWidth > 200 && window.innerHeight > 200;
    };

    // Function inspection detection
    const detectFunctionInspection = () => {
      if (!initialLoadComplete) return false;
      
      let detected = false;
      const func = () => {};
      const original = func.toString;
      
      func.toString = function() {
        detected = true;
        return original.call(this);
      };
      
      try {
        console.log(func);
        console.clear();
      } catch (e) {
        detected = true;
      }
      
      func.toString = original;
      return detected;
    };

    // DevTools object detection
    const detectDevToolsObject = () => {
      if (!initialLoadComplete) return false;
      
      return !!(
        window.devtools ||
        window.chrome?.devtools ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
      );
    };

    // Main detection with immediate action
    const runDevToolsDetection = () => {
      if (devToolsDetected || !initialLoadComplete) return;

      const detectionMethods = [
        detectConsoleOpen,
        detectDebuggerOpen,
        detectDevToolsPanel,
        detectFunctionInspection,
        detectDevToolsObject
      ];

      let detectionCount = 0;
      detectionMethods.forEach(method => {
        try {
          if (method()) {
            detectionCount++;
          }
        } catch (e) {
          detectionCount++;
        }
      });

      // Immediate action if 2 or more methods detect
      if (detectionCount >= 2) {
        closeWebsiteImmediately();
      }
    };

    // Immediate keyboard shortcut detection
    const handleKeyDown = (e: KeyboardEvent) => {
      const devToolsShortcuts = [
        e.key === 'F12',
        e.keyCode === 123,
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)),
        (e.ctrlKey && e.keyCode === 85),
        (e.metaKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)),
        (e.metaKey && e.keyCode === 85),
        (e.ctrlKey && e.keyCode === 83), // Ctrl+S
        (e.metaKey && e.keyCode === 83), // Cmd+S
      ];

      if (devToolsShortcuts.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        if (initialLoadComplete) {
          closeWebsiteImmediately();
        }
        return false;
      }
    };

    // Enhanced right-click protection
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      if (initialLoadComplete) {
        // Immediate detection after right-click
        setTimeout(() => {
          runDevToolsDetection();
        }, 100);
      }
      
      return false;
    };

    // Window events
    const handleResize = () => {
      if (initialLoadComplete && !devToolsDetected) {
        setTimeout(runDevToolsDetection, 300);
      }
    };

    const handleFocus = () => {
      if (initialLoadComplete && !devToolsDetected) {
        setTimeout(runDevToolsDetection, 200);
      }
    };

    const handleVisibilityChange = () => {
      if (initialLoadComplete && !devToolsDetected && !document.hidden) {
        setTimeout(runDevToolsDetection, 100);
      }
    };

    // Enhanced protection styles
    const addProtectionStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          -webkit-touch-callout: none !important;
          -webkit-context-menu: none !important;
          pointer-events: auto !important;
        }
        
        input, textarea, [contenteditable="true"] {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }

        body {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -khtml-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }

        /* Disable drag and drop */
        * {
          -webkit-user-drag: none !important;
          -khtml-user-drag: none !important;
          -moz-user-drag: none !important;
          -o-user-drag: none !important;
          user-drag: none !important;
        }
      `;
      document.head.appendChild(style);
      return style;
    };

    // Override console methods to detect usage
    const originalConsole = { ...console };
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      (console as any)[method] = function(...args: any[]) {
        if (initialLoadComplete && !devToolsDetected) {
          setTimeout(() => {
            runDevToolsDetection();
          }, 50);
        }
        return originalConsole[method as keyof typeof originalConsole].apply(console, args);
      };
    });

    // Set up all event listeners with capture phase
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    document.addEventListener('contextmenu', handleRightClick, { capture: true, passive: false });
    document.addEventListener('selectstart', (e) => { e.preventDefault(); return false; }, { capture: true, passive: false });
    document.addEventListener('dragstart', (e) => { e.preventDefault(); return false; }, { capture: true, passive: false });
    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Add protection styles
    const styleElement = addProtectionStyles();

    // Continuous detection (more frequent)
    detectionInterval = setInterval(() => {
      if (!devToolsDetected && initialLoadComplete) {
        runDevToolsDetection();
      }
    }, 1000);

    // Iframe detection
    if (window.self !== window.top) {
      setTimeout(() => {
        if (initialLoadComplete) {
          closeWebsiteImmediately();
        }
      }, 1000);
    }

    // Cleanup
    return () => {
      clearTimeout(initialLoadTimer);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleRightClick, true);
      document.removeEventListener('selectstart', () => {}, true);
      document.removeEventListener('dragstart', () => {}, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus);
      
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
      
      if (styleElement?.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }

      // Restore console
      Object.assign(console, originalConsole);
    };
  }, []);

  return null;
};

export default DevToolsProtection;