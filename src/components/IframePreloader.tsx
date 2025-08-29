import React, { useEffect } from 'react';

const IframePreloader: React.FC = () => {
  useEffect(() => {
    // Preload iframe content in hidden iframes for instant loading
    const preloadIframes = () => {
      const iframesToPreload = [
        'https://jsgfiuwgerfmsajdk.netlify.app',
        'https://nexttoppers-krgb-alphaproject.netlify.app/'
      ];

      iframesToPreload.forEach((src, index) => {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
          border: none;
          visibility: hidden;
        `;
        iframe.setAttribute('aria-hidden', 'true');
        iframe.setAttribute('tabindex', '-1');
        
        // Add load event listener to track preloading
        iframe.onload = () => {
          console.log(`Preloaded iframe ${index + 1}/${iframesToPreload.length}`);
        };
        
        iframe.onerror = () => {
          console.warn(`Failed to preload iframe: ${src}`);
        };

        document.body.appendChild(iframe);
      });
    };

    // Start preloading after a short delay
    const preloadTimer = setTimeout(preloadIframes, 1000);

    return () => {
      clearTimeout(preloadTimer);
    };
  }, []);

  return null;
};

export default IframePreloader;