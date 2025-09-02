import React, { useEffect, useState } from 'react';

const IframePreloader: React.FC = () => {
  const [preloadStatus, setPreloadStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Preload iframe content with better performance
    const preloadIframes = () => {
      const iframesToPreload = [
        { url: 'https://jsgfiuwgerfmsajdk.netlify.app', name: 'batches' },
        { url: 'https://irsion-10-0-hq44-alphaproject.netlify.app/', name: 'liveClasses' }
      ];

      iframesToPreload.forEach(({ url, name }) => {
        // Create a lightweight preload using link prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);

        // Also create a hidden iframe for faster loading
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 320px;
          height: 240px;
          opacity: 0;
          pointer-events: none;
          border: none;
          visibility: hidden;
        `;
        iframe.setAttribute('aria-hidden', 'true');
        iframe.setAttribute('tabindex', '-1');
        iframe.setAttribute('loading', 'eager');
        
        // Add load event listener
        iframe.onload = () => {
          console.log(`✅ Preloaded: ${name}`);
          setPreloadStatus(prev => ({ ...prev, [name]: true }));
          
          // Remove iframe after successful preload to save memory
          setTimeout(() => {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          }, 5000);
        };
        
        iframe.onerror = () => {
          console.warn(`❌ Failed to preload: ${name}`);
          setPreloadStatus(prev => ({ ...prev, [name]: false }));
          
          // Remove failed iframe immediately
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        };

        // Set timeout to remove iframe if it takes too long
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 15000);

        document.body.appendChild(iframe);
      });
    };

    // Start preloading immediately
    preloadIframes();

    // Cleanup function
    return () => {
      // Remove any remaining preload links
      const preloadLinks = document.querySelectorAll('link[rel="prefetch"]');
      preloadLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  return null;
};

export default IframePreloader;