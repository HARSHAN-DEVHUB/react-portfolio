import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaSpinner, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email is invalid";
    if (!form.message.trim()) errors.message = "Message is required";
    else if (form.message.length < 10) errors.message = "Message must be at least 10 characters";
    
    return Object.keys(errors).length === 0 ? null : errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Enhanced form submission with better error handling
      const response = await fetch('https://formspree.io/f/xjkbwozn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          subject: `Portfolio Contact from ${form.name}`,
          _replyto: form.email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setForm({ name: "", email: "", message: "" });
        
        // Track successful form submission
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submit', {
            event_category: 'Contact',
            event_label: 'Portfolio Contact Form',
          });
        }
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-fuchsia-500 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-lg mx-auto px-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 px-8 py-12">
          <h2 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-gray-300 mb-8 text-center text-lg">
            Interested in working together, have a question, or just want to connect?  
            Fill out the form below or reach out directly.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label className="block text-sm mb-2 text-gray-300 font-medium" htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white transition-all duration-200"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-gray-300 font-medium" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-2 text-gray-300 font-medium" htmlFor="message">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white resize-none transition-all duration-200"
                placeholder="Tell me about your project or just say hello!"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <FaCheck />
                  Message Sent!
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
              Thank you! Your message has been sent successfully. I'll get back to you soon!
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center flex items-center gap-2 justify-center">
              <FaExclamationTriangle />
              Oops! Something went wrong. Please try again or email me directly.
            </div>
          )}

          <div className="mt-8 text-center text-gray-400 text-sm">
            Or email me directly:{" "}
            <a href="mailto:harshanharshu66@gmail.com" className="text-purple-300 hover:underline font-medium">
              harshanharshu66@gmail.com
            </a>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
            <a 
              href="https://github.com/HARSHAN-DEVHUB" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub" 
              className="text-2xl text-gray-400 hover:text-purple-400 transition-colors duration-200 hover:scale-110"
            >
              <FaGithub />
            </a>
            <a 
              href="https://www.linkedin.com/in/harshan-harshu" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="text-2xl text-gray-400 hover:text-indigo-400 transition-colors duration-200 hover:scale-110"
            >
              <FaLinkedin />
            </a>
            <a 
              href="mailto:harshanharshu66@gmail.com" 
              aria-label="Email" 
              className="text-2xl text-gray-400 hover:text-fuchsia-400 transition-colors duration-200 hover:scale-110"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
