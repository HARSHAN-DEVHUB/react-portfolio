import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      // Google Analytics 4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
      
      // Custom analytics
      const analyticsData = {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
      };
      
      // Send to your analytics endpoint (optional)
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analyticsData),
      // });
      
      console.log('Page view tracked:', analyticsData);
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > 25 && scrollPercent <= 50) {
        console.log('User scrolled 25-50%');
      } else if (scrollPercent > 50 && scrollPercent <= 75) {
        console.log('User scrolled 50-75%');
      } else if (scrollPercent > 75) {
        console.log('User scrolled 75%+');
      }
    };

    // Track time on page
    let startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 30) {
        console.log(`User spent ${timeSpent} seconds on page`);
      }
    };

    // Track interactions
    const trackInteraction = (event) => {
      const target = event.target;
      const interactionData = {
        type: event.type,
        element: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 50),
        timestamp: new Date().toISOString(),
      };
      
      console.log('Interaction tracked:', interactionData);
    };

    // Initialize tracking
    trackPageView();
    
    // Set up event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    
    // Track important interactions
    const trackableElements = document.querySelectorAll('a, button, [role="button"]');
    trackableElements.forEach(element => {
      element.addEventListener('click', trackInteraction);
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      trackableElements.forEach(element => {
        element.removeEventListener('click', trackInteraction);
      });
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Alternative: Simple page view counter
export function PageViewCounter() {
  useEffect(() => {
    // Simple page view tracking (you can replace this with your own analytics)
    const pageViews = localStorage.getItem('pageViews') || 0;
    const newPageViews = parseInt(pageViews) + 1;
    localStorage.setItem('pageViews', newPageViews.toString());
    
    // You could send this to your own analytics endpoint
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ pageViews: newPageViews }) });
  }, []);

  return null;
} 