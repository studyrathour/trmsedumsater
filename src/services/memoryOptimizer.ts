// Memory optimization utilities for better performance

export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private cleanupTasks: (() => void)[] = [];
  private memoryCheckInterval: NodeJS.Timeout | null = null;

  static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  // Initialize memory optimization
  initialize() {
    this.setupMemoryMonitoring();
    this.optimizeIframes();
    this.setupImageOptimization();
    this.setupChatOptimization();
  }

  // Monitor memory usage
  private setupMemoryMonitoring() {
    this.memoryCheckInterval = setInterval(() => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = memInfo.usedJSHeapSize / 1048576;
        const limitMB = memInfo.jsHeapSizeLimit / 1048576;
        
        // If memory usage is above 80%, trigger cleanup
        if (usedMB / limitMB > 0.8) {
          this.performMemoryCleanup();
        }
      }
    }, 30000); // Check every 30 seconds
  }

  // Optimize iframe loading and memory usage
  private optimizeIframes() {
    // Remove unused iframes after navigation
    const observer = new MutationObserver(() => {
      const hiddenIframes = document.querySelectorAll('iframe[style*="position: absolute"][style*="top: -9999px"]');
      hiddenIframes.forEach(iframe => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.cleanupTasks.push(() => observer.disconnect());
  }

  // Optimize image loading
  private setupImageOptimization() {
    // Lazy load images that are not in viewport
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    this.cleanupTasks.push(() => imageObserver.disconnect());
  }

  // Optimize chat performance
  private setupChatOptimization() {
    // Limit chat message history to prevent memory bloat
    const maxMessages = 50;
    
    // This will be called from the chatbot component
    window.optimizeChatMessages = (messages: any[]) => {
      if (messages.length > maxMessages) {
        return messages.slice(-maxMessages);
      }
      return messages;
    };
  }

  // Perform memory cleanup
  private performMemoryCleanup() {
    console.log('🧹 Performing memory cleanup...');
    
    // Clear unused DOM elements
    const unusedElements = document.querySelectorAll('[data-cleanup="true"]');
    unusedElements.forEach(el => el.remove());
    
    // Clear cached images that are not visible
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isVisible && img.src.startsWith('data:')) {
        img.src = '';
      }
    });
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    console.log('✅ Memory cleanup completed');
  }

  // Cleanup all resources
  cleanup() {
    this.cleanupTasks.forEach(task => task());
    this.cleanupTasks = [];
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
  }
}

// Initialize memory optimizer
export const initializeMemoryOptimizer = () => {
  const optimizer = MemoryOptimizer.getInstance();
  optimizer.initialize();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    optimizer.cleanup();
  });
  
  return optimizer;
};

// Iframe loading optimization
export const optimizeIframeLoading = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = `${url}/favicon.ico`; // Try to load favicon first
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(true), 5000);
  });
};

// Preload critical resources
export const preloadCriticalResources = () => {
  const criticalUrls = [
    'https://jsgfiuwgerfmsajdk.netlify.app',
    'https://irsion-10-0-hq44-alphaproject.netlify.app/'
  ];

  criticalUrls.forEach(url => {
    // Use DNS prefetch for faster connection
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = url;
    document.head.appendChild(dnsLink);

    // Use preconnect for even faster loading
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = url;
    document.head.appendChild(preconnectLink);
  });
};