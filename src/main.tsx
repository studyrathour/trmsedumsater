import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMemoryOptimizer, preloadCriticalResources } from './services/memoryOptimizer';

// Initialize performance optimizations
initializeMemoryOptimizer();
preloadCriticalResources();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
