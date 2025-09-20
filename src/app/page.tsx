'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Custom cursor effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Orbital Loading Animation */}
        <div className="spinner-box">
          <div className="leo blue-orbit"></div>
          <div className="leo green-orbit"></div>
          <div className="leo red-orbit"></div>
          <div className="leo white-orbit w1"></div>
          <div className="leo white-orbit w2"></div>
          <div className="leo white-orbit w3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom Cursor */}
      <div 
        className="cursor fixed w-12 h-12 border border-cyan-400 rounded-full pointer-events-none z-50 transition-all duration-100 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px #73cdbe'
        }}
      />
      <div 
        className="cursor2 fixed w-8 h-8 bg-transparent rounded-full pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px #73cdbe'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-2xl font-bold text-white">Bhuvesh</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300">About</a>
          <a href="#projects" className="text-gray-300 hover:text-white transition-colors duration-300">Projects</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a>
        </div>
      </nav>

      {/* Main Container with Scroll Snap */}
      <div className="main-container">
        {/* Hero Section */}
        <section className="homeHeader">
          <div className="max-w-6xl mx-auto text-center px-6">
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 animate">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text">
                My Portfolio
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              I&apos;m a passionate developer creating amazing digital experiences with modern technologies and cutting-edge animations.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25">
                Get Started
              </button>
              <button className="border-2 border-cyan-400 text-cyan-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105">
                View Projects
              </button>
            </div>

            {/* 3D Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              <div className="card">
                <div className="wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop" 
                    alt="Code" 
                    className="cover-image"
                  />
                  <div className="character">
                    <img 
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop" 
                      alt="Code Character" 
                      className="character"
                    />
                  </div>
                </div>
                <div className="name_title">
                  <h3 className="text-2xl font-bold text-white mb-2">Clean Code</h3>
                  <p className="text-gray-300">Writing maintainable and scalable code with best practices.</p>
                </div>
              </div>

              <div className="card">
                <div className="wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" 
                    alt="Performance" 
                    className="cover-image"
                  />
                  <div className="character">
                    <img 
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop" 
                      alt="Performance Character" 
                      className="character"
                    />
                  </div>
                </div>
                <div className="name_title">
                  <h3 className="text-2xl font-bold text-white mb-2">Fast Performance</h3>
                  <p className="text-gray-300">Optimized applications that deliver exceptional user experiences.</p>
                </div>
              </div>

              <div className="card">
                <div className="wrapper">
                  <img 
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop" 
                    alt="User Experience" 
                    className="cover-image"
                  />
                  <div className="character">
                    <img 
                      src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop" 
                      alt="UX Character" 
                      className="character"
                    />
                  </div>
                </div>
                <div className="name_title">
                  <h3 className="text-2xl font-bold text-white mb-2">User Focused</h3>
                  <p className="text-gray-300">Designing with users in mind for intuitive and engaging interfaces.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="aboutContainer">
          <div className="aboutHeroContainer">
            <div className="aboutLeft">
              <h2 className="aboutTitle text-5xl font-bold mb-8">About Me</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I&apos;m a passionate developer with expertise in modern web technologies. 
                I love creating beautiful, performant applications that provide exceptional user experiences.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                My journey in development has led me to master various technologies including 
                React, Next.js, TypeScript, and modern CSS frameworks.
              </p>
            </div>
            <div className="aboutRight">
              <div className="frame">
                <div className="core"></div>
                <div className="orbit" style={{'--duration': '3s'} as React.CSSProperties}>
                  <div className="electron"></div>
                </div>
                <div className="orbit" style={{'--duration': '4s'} as React.CSSProperties}>
                  <div className="electron"></div>
                </div>
                <div className="orbit" style={{'--duration': '5s'} as React.CSSProperties}>
                  <div className="electron"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contactContainer">
          <div className="contactHeroContainer">
            <div className="contactCard">
              <h2 className="title text-5xl font-bold mb-8">Get In Touch</h2>
              <div className="formContainer">
                <form className="contactForm">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="formControl"
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="formControl"
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className="formControl"
                  />
                  <button type="submit" className="submitBtn">
                    Send Message
                  </button>
                </form>
                <div className="socials">
                  <a href="#" className="socialIcon">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="socialIcon">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="socialIcon">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="astronaut">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" fill="url(#gradient)" opacity="0.3"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#73cdbe"/>
                      <stop offset="100%" stopColor="#4f46e5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}