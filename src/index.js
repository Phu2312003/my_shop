import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app';
import { performanceMonitor } from './utils/performance';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize performance monitoring
window.addEventListener('load', () => {
  // Measure initial page load
  setTimeout(() => {
    performanceMonitor.measurePageLoad();
    performanceMonitor.getMemoryUsage();
    performanceMonitor.monitorNetworkRequests();
    performanceMonitor.initWebVitals();
  }, 0);
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, notify user
                if (confirm('New content is available! Reload to get the latest version?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
