import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import Analytics from "./components/Analytics";
import SEO from "./components/SEO";
import Performance from "./components/Performance";
import Resume from "./components/Resume";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <div className={`bg-black text-white scroll-smooth transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Background gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black pointer-events-none z-0" />
        
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse opacity-20" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-500 rounded-full animate-ping opacity-30" />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce opacity-15" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-25" />
        </div>

        <div className="relative z-10">
          <SEO />
          <Analytics />
          <Performance />
          <Header />
          <main className="pt-16">
            <section id="hero"><Hero /></section>
            <About />
            <Skills />
            <Projects />
            <Resume />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
