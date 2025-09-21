'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const handleGetStarted = () => {
    setActiveSection('about');
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setMounted(true);

    // Loading timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Safety timeout to ensure loading doesn't get stuck
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Orbital rings */}
          <div
            className="absolute w-64 h-64 border border-blue-400/30 rounded-full animate-spin"
            style={{ animationDuration: '3s' }}
          ></div>
          <div
            className="absolute w-48 h-48 border border-green-400/30 rounded-full animate-spin"
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          ></div>
          <div
            className="absolute w-36 h-36 border border-red-400/30 rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
          ></div>
          <div
            className="absolute w-24 h-24 border-2 border-white rounded-full animate-spin"
            style={{ animationDuration: '10s', animationDirection: 'reverse' }}
          ></div>

          {/* Center pulsing dot */}
          <div
            className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDuration: '2s' }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="absolute bottom-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Portfolio
          </h2>
          <p className="text-cyan-400 text-lg">
            Preparing amazing experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-400/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-white">Bhuvesh</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('home')}
                className={`transition-colors duration-300 ${
                  activeSection === 'home'
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`transition-colors duration-300 ${
                  activeSection === 'about'
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className={`transition-colors duration-300 ${
                  activeSection === 'projects'
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Projects
              </button>
              <a
                href="/blog"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Blog
              </a>
              <a
                href="/resume"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Resume
              </a>
              <a
                href="/services"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Services
              </a>
              <button
                onClick={() => scrollToSection('contact')}
                className={`transition-colors duration-300 ${
                  activeSection === 'contact'
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 pt-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-cyan-400">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            I&apos;m a passionate{' '}
            <span className="text-cyan-400 font-semibold">
              Full-Stack Developer
            </span>
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Creating amazing digital experiences with modern technologies and
            cutting-edge solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-cyan-400 text-black px-8 py-4 rounded-lg font-bold hover:bg-cyan-300 transition-colors transform hover:scale-105 active:scale-95 text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-colors text-lg"
            >
              View Projects
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
              About Me
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Passionate developer with expertise in modern web technologies
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  My Journey
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  I&apos;m a passionate developer with expertise in modern web
                  technologies. I love creating beautiful, performant
                  applications that solve real-world problems.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  My journey has led me to master React, Next.js, TypeScript,
                  and modern CSS frameworks. I&apos;m always learning and
                  staying up-to-date with the latest technologies.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Skills & Technologies
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'React',
                    'Next.js',
                    'TypeScript',
                    'Tailwind',
                    'Node.js',
                    'MongoDB',
                    'Python',
                    'Git',
                    'Docker',
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="bg-cyan-400/10 border border-cyan-400/30 rounded-full px-4 py-2 text-center text-sm text-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-pointer"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full flex items-center justify-center border border-cyan-400/20">
                  <div className="text-6xl">🚀</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
              My Projects
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Here are some of my recent projects and work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'E-Commerce Platform',
                description:
                  'Full-stack e-commerce solution with React, Node.js, and MongoDB',
                tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                status: 'Completed',
              },
              {
                title: 'Task Management App',
                description:
                  'Collaborative task management tool with real-time updates',
                tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
                status: 'In Progress',
              },
              {
                title: 'Portfolio Website',
                description:
                  'Modern portfolio website with animations and responsive design',
                tech: ['Next.js', 'Tailwind', 'Framer Motion'],
                status: 'Completed',
              },
            ].map((project, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="bg-cyan-400/10 text-cyan-400 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 py-2 rounded-lg hover:bg-cyan-400/20 transition-colors">
                  View Project
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Let&apos;s work together to bring your ideas to life
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                Send me a message
              </h3>

              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-400 text-black py-3 rounded-lg font-bold hover:bg-cyan-300 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-xl">📧</span>
                    </div>
                    <div>
                      <p className="text-gray-300">Email</p>
                      <p className="text-white">bhuvesh@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                      <span className="text-cyan-400 text-xl">📍</span>
                    </div>
                    <div>
                      <p className="text-gray-300">Location</p>
                      <p className="text-white">Your City, Country</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Follow Me
                </h3>
                <div className="flex space-x-4">
                  {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                    <button
                      key={social}
                      className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-6 py-3 rounded-lg hover:bg-cyan-400/20 transition-colors"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
