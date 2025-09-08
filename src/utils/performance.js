// Performance monitoring utilities
export const performanceMonitor = {
    // Measure page load time
    measurePageLoad() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            return loadTime;
        }
        return null;
    },

    // Measure component render time
    measureRenderTime(componentName, startTime) {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
        return renderTime;
    },

    // Monitor memory usage
    getMemoryUsage() {
        if (window.performance && window.performance.memory) {
            const mem = window.performance.memory;
            console.log('Memory Usage:', {
                used: Math.round(mem.usedJSHeapSize / 1048576 * 100) / 100 + ' MB',
                total: Math.round(mem.totalJSHeapSize / 1048576 * 100) / 100 + ' MB',
                limit: Math.round(mem.jsHeapSizeLimit / 1048576 * 100) / 100 + ' MB'
            });
            return mem;
        }
        return null;
    },

    // Monitor network requests
    monitorNetworkRequests() {
        if (window.performance && window.performance.getEntriesByType) {
            const resources = window.performance.getEntriesByType('resource');
            const networkStats = resources.map(entry => ({
                url: entry.name,
                duration: entry.duration,
                size: entry.transferSize,
                type: entry.initiatorType
            }));

            console.log('Network requests:', networkStats);
            return networkStats;
        }
        return [];
    },

    // Web Vitals monitoring
    initWebVitals() {
        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ type: 'layout-shift', buffered: true });

        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // FID (First Input Delay)
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ type: 'first-input', buffered: true });
    }
};

// Debounce utility for performance
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Image lazy loading utility
export const lazyLoadImage = (imgElement, src) => {
    const image = new Image();
    image.onload = () => {
        imgElement.src = src;
        imgElement.classList.remove('blur-sm');
    };
    image.src = src;
};

// Bundle size analyzer (for development)
export const analyzeBundleSize = () => {
    if (process.env.NODE_ENV === 'development') {
        // This would integrate with webpack-bundle-analyzer
        console.log('Bundle analysis available in development mode');
    }
};
