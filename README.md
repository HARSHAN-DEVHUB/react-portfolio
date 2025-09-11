# Harshan Portfolio 🚀

A modern, responsive portfolio website showcasing my skills as a Creative Developer and Ethical Hacker. Built with React, Tailwind CSS, and Framer Motion.

## ✨ Features

### 🎨 **Visual Design**
- **Modern Dark Theme** - Elegant dark mode with purple/indigo gradients
- **Smooth Animations** - Framer Motion powered animations and transitions
- **Responsive Design** - Optimized for all devices and screen sizes
- **Interactive Elements** - Hover effects, micro-interactions, and particle effects
- **Loading Screen** - Professional loading animation with progress bar

### 🚀 **Performance & SEO**
- **Lightning Fast** - Optimized with Vite and modern build tools
- **SEO Optimized** - Meta tags, structured data, and sitemap
- **PWA Ready** - Service worker for offline support and caching
- **Core Web Vitals** - Optimized for LCP, FID, and CLS
- **Analytics** - Built-in tracking for user interactions

### 📱 **User Experience**
- **Smooth Scrolling** - Enhanced navigation with scroll animations
- **Contact Form** - Integrated with Formspree for reliable messaging
- **Project Showcase** - Interactive project gallery with filtering
- **Skills Display** - Animated skill bars and technology badges
- **Social Integration** - Direct links to GitHub, LinkedIn, and email

### 🔧 **Technical Features**
- **React 19** - Latest React with modern hooks and patterns
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions
- **Service Worker** - Offline support and caching
- **Performance Monitoring** - Real-time performance tracking

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HARSHAN-ASMODAY/Official-portfolio.git
   cd Official-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📝 Configuration

### Contact Form Setup
1. Go to [Formspree](https://formspree.io)
2. Create a new form
3. Replace `YOUR_FORM_ID` in `src/components/Contact.jsx`
4. Test the form functionality

### Analytics Setup
1. Create a Google Analytics 4 property
2. Replace `G-XXXXXXXXXX` in `src/components/Analytics.jsx`
3. Add your Google Analytics script to `index.html`

### SEO Configuration
- Update URLs in `public/sitemap.xml`
- Modify meta tags in `src/components/SEO.jsx`
- Update social media links in components

## 🎯 Customization

### Personal Information
- Update personal details in `src/components/Hero.jsx`
- Replace profile image in `public/Me.jpg`
- Update social media links throughout components
- Modify project data in `src/components/Projects.jsx`

### Styling
- Customize colors in `tailwind.config.cjs`
- Modify animations in component files
- Update gradients and effects as needed

### Content
- Add your real projects and screenshots
- Update skills and certifications
- Write compelling about section
- Add your resume to `public/resume.pdf`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Configure custom domain if needed

### Netlify
1. Build the project: `npm run build`
2. Upload `dist` folder to Netlify
3. Configure redirects for SPA routing

### GitHub Pages
1. Add `"homepage": "https://username.github.io/repo-name"` to package.json
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deploy script: `"deploy": "gh-pages -d dist"`
4. Run: `npm run build && npm run deploy`

## 📊 Performance

### Lighthouse Scores
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🔧 Technical Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4
- **Forms**: Formspree
- **PWA**: Service Worker

## 📁 Project Structure

```
my-portfolio/
├── public/
│   ├── Me.jpg                 # Profile image
│   ├── sw.js                  # Service worker
│   ├── robots.txt             # SEO robots file
│   ├── sitemap.xml           # SEO sitemap
│   └── site.webmanifest      # PWA manifest
├── src/
│   ├── components/
│   │   ├── Analytics.jsx     # Analytics tracking
│   │   ├── SEO.jsx           # SEO optimization
│   │   ├── Performance.jsx   # Performance monitoring
│   │   ├── LoadingSpinner.jsx # Loading screen
│   │   └── ...               # Other components
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── index.html                # HTML template
└── package.json              # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) to Indigo (#6366F1)
- **Background**: Dark gray (#0F0F23) to black
- **Text**: White and gray variations
- **Accents**: Fuchsia, blue, and green highlights

### Typography
- **Headings**: Bold, large fonts with gradients
- **Body**: Clean, readable sans-serif
- **Code**: Monospace for technical content

### Animations
- **Entrance**: Fade in with slide effects
- **Hover**: Scale and color transitions
- **Scroll**: Parallax and reveal animations
- **Loading**: Smooth progress indicators

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Icons](https://react-icons.github.io/react-icons/) for icons
- [Formspree](https://formspree.io/) for contact forms

## 📞 Contact

- **Portfolio**: [harshan-portfolio.vercel.app](https://harshan-portfolio.vercel.app)
- **GitHub**: [@HARSHAN-ASMODAY](https://github.com/HARSHAN-ASMODAY)
- **LinkedIn**: [harshan-dev](https://linkedin.com/in/harshan-dev)
- **Email**: harshan@example.com

---

⭐ **Star this repository if you found it helpful!**
