import { useEffect } from 'react';

export default function SEO() {
  useEffect(() => {
    // Update document title and meta tags
    const updateMetaTags = () => {
      // Update title
      document.title = "Harshan - Creative Developer & Ethical Hacker | Portfolio";
      
      // Update or create meta tags
      const metaTags = {
        'description': 'Creative developer and ethical hacker specializing in React, Node.js, and cybersecurity. View my portfolio of web applications, security tools, and innovative projects.',
        'keywords': 'developer, ethical hacker, React, Node.js, cybersecurity, web development, portfolio, JavaScript, Python',
        'author': 'Harshan',
        'robots': 'index, follow',
        'viewport': 'width=device-width, initial-scale=1.0',
        'theme-color': '#1f2937',
      };

      // Update existing meta tags or create new ones
      Object.entries(metaTags).forEach(([name, content]) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      });

      // Open Graph tags for social media
      const ogTags = {
        'og:title': 'Harshan - Creative Developer & Ethical Hacker',
        'og:description': 'Creative developer and ethical hacker specializing in React, Node.js, and cybersecurity. View my portfolio of web applications, security tools, and innovative projects.',
        'og:type': 'website',
        'og:url': window.location.href,
        'og:image': `${window.location.origin}/Me.jpg`,
        'og:site_name': 'Harshan Portfolio',
        'og:locale': 'en_US',
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      });

      // Twitter Card tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': 'Harshan - Creative Developer & Ethical Hacker',
        'twitter:description': 'Creative developer and ethical hacker specializing in React, Node.js, and cybersecurity.',
        'twitter:image': `${window.location.origin}/Me.jpg`,
        'twitter:creator': '@harshan_dev',
      };

      Object.entries(twitterTags).forEach(([name, content]) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      });

      // Structured data (JSON-LD)
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Harshan",
        "jobTitle": "Creative Developer & Ethical Hacker",
        "description": "Creative developer and ethical hacker specializing in React, Node.js, and cybersecurity.",
        "url": window.location.href,
        "image": `${window.location.origin}/Me.jpg`,
        "sameAs": [
          "https://github.com/HARSHAN-DEVHUB",
          "https://www.linkedin.com/in/harshan-harshu",
        ],
        "knowsAbout": [
          "React", "Node.js", "JavaScript", "Python", "Cybersecurity", 
          "Web Development", "Ethical Hacking", "UI/UX Design"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Portsmouth",
          "addressCountry": "United Kingdom"
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance"
        }
      };

      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Add new structured data
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    updateMetaTags();

    // Update meta tags when route changes (if using SPA routing)
    const handleRouteChange = () => {
      updateMetaTags();
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
} 