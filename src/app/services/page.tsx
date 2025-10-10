'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Services() {
  const [selectedService, setSelectedService] = useState('web-development');

  const services = [
    {
      id: 'web-development',
      title: 'Web Development',
      icon: '🌐',
      description:
        'Custom web applications built with modern technologies and best practices.',
      features: [
        'Responsive Design',
        'Performance Optimization',
        'SEO Optimization',
        'Cross-browser Compatibility',
        'Mobile-first Approach',
        'Accessibility Compliance',
      ],
      technologies: [
        'React',
        'Next.js',
        'Vue.js',
        'TypeScript',
        'Tailwind CSS',
      ],
      pricing: 'Starting at $2,500',
      timeline: '2-8 weeks',
      popular: true,
    },
    {
      id: 'mobile-apps',
      title: 'Mobile App Development',
      icon: '📱',
      description:
        'Native and cross-platform mobile applications for iOS and Android.',
      features: [
        'Cross-platform Development',
        'Native Performance',
        'App Store Optimization',
        'Push Notifications',
        'Offline Functionality',
        'User Authentication',
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      pricing: 'Starting at $5,000',
      timeline: '4-12 weeks',
      popular: false,
    },
    {
      id: 'backend-development',
      title: 'Backend Development',
      icon: '⚙️',
      description:
        'Scalable server-side applications and APIs for your business needs.',
      features: [
        'RESTful APIs',
        'GraphQL APIs',
        'Database Design',
        'Authentication & Authorization',
        'Cloud Integration',
        'Microservices Architecture',
      ],
      technologies: [
        'Node.js',
        'Python',
        'PostgreSQL',
        'MongoDB',
        'AWS',
        'Docker',
      ],
      pricing: 'Starting at $3,000',
      timeline: '3-10 weeks',
      popular: false,
    },
    {
      id: 'e-commerce',
      title: 'E-commerce Solutions',
      icon: '🛒',
      description:
        'Complete e-commerce platforms with payment integration and inventory management.',
      features: [
        'Payment Gateway Integration',
        'Inventory Management',
        'Order Processing',
        'Customer Management',
        'Analytics Dashboard',
        'Multi-vendor Support',
      ],
      technologies: [
        'Shopify',
        'WooCommerce',
        'Stripe',
        'PayPal',
        'React',
        'Node.js',
      ],
      pricing: 'Starting at $4,000',
      timeline: '4-16 weeks',
      popular: true,
    },
    {
      id: 'consulting',
      title: 'Technical Consulting',
      icon: '💡',
      description:
        'Expert guidance on technology decisions, architecture, and development strategies.',
      features: [
        'Technology Assessment',
        'Architecture Planning',
        'Code Review',
        'Performance Audit',
        'Security Assessment',
        'Team Training',
      ],
      technologies: ['Various', 'Best Practices', 'Industry Standards'],
      pricing: '$150/hour',
      timeline: 'Flexible',
      popular: false,
    },
    {
      id: 'maintenance',
      title: 'Maintenance & Support',
      icon: '🔧',
      description:
        'Ongoing maintenance, updates, and support for your existing applications.',
      features: [
        'Bug Fixes',
        'Security Updates',
        'Performance Monitoring',
        'Feature Enhancements',
        '24/7 Support',
        'Backup & Recovery',
      ],
      technologies: ['Various', 'Monitoring Tools', 'CI/CD'],
      pricing: 'Starting at $500/month',
      timeline: 'Ongoing',
      popular: false,
    },
  ];

  const process = [
    {
      step: 1,
      title: 'Discovery & Planning',
      description:
        'We start by understanding your requirements, goals, and target audience.',
      duration: '1-2 weeks',
      deliverables: [
        'Project Scope',
        'Technical Specification',
        'Timeline & Budget',
      ],
    },
    {
      step: 2,
      title: 'Design & Prototyping',
      description:
        'Creating wireframes, mockups, and interactive prototypes for your approval.',
      duration: '1-3 weeks',
      deliverables: ['Wireframes', 'UI/UX Design', 'Interactive Prototype'],
    },
    {
      step: 3,
      title: 'Development',
      description:
        'Building your application using modern technologies and best practices.',
      duration: '2-12 weeks',
      deliverables: ['Core Features', 'Testing', 'Code Documentation'],
    },
    {
      step: 4,
      title: 'Testing & Quality Assurance',
      description:
        'Thorough testing to ensure your application works perfectly across all devices.',
      duration: '1-2 weeks',
      deliverables: ['Bug Reports', 'Performance Testing', 'Security Audit'],
    },
    {
      step: 5,
      title: 'Deployment & Launch',
      description:
        'Deploying your application and ensuring everything runs smoothly.',
      duration: '1 week',
      deliverables: ['Live Application', 'Documentation', 'Training'],
    },
    {
      step: 6,
      title: 'Support & Maintenance',
      description:
        'Ongoing support and maintenance to keep your application running smoothly.',
      duration: 'Ongoing',
      deliverables: ['Bug Fixes', 'Updates', 'Performance Monitoring'],
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content:
        'Bhuvesh delivered an exceptional web application that exceeded our expectations. His attention to detail and technical expertise made all the difference.',
      rating: 5,
      project: 'E-commerce Platform',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Founder, Digital Agency',
      content:
        'Working with Bhuvesh was a game-changer for our business. He understood our vision and brought it to life with cutting-edge technology.',
      rating: 5,
      project: 'Mobile App Development',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Marketing Director, Retail Corp',
      content:
        'The website Bhuvesh built for us has significantly improved our online presence and customer engagement. Highly recommended!',
      rating: 5,
      project: 'Corporate Website',
    },
  ];

  const selectedServiceData = services.find(
    service => service.id === selectedService
  );

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-400/20'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>B</span>
              </div>
              <span className='text-xl font-bold text-white'>Bhuvesh</span>
            </div>

            <div className='hidden md:flex items-center space-x-8'>
              <Link
                href='/'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                Home
              </Link>
              <Link
                href='/#about'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                About
              </Link>
              <Link
                href='/#projects'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                Projects
              </Link>
              <Link
                href='/blog'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                Blog
              </Link>
              <Link
                href='/resume'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                Resume
              </Link>
              <span className='text-cyan-400'>Services</span>
              <Link
                href='/#contact'
                className='text-gray-300 hover:text-white transition-colors duration-300'
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-16 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 text-cyan-400'>
            My Services
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Comprehensive web development and technology solutions to bring your
            ideas to life.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className='px-6 pb-16'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-white mb-8 text-center'>
            What I Offer
          </h2>
          <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {services.map(service => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedService === service.id
                    ? 'border-cyan-400 bg-white/10'
                    : 'border-cyan-400/20 hover:border-cyan-400/40 hover:bg-white/8'
                } ${service.popular ? 'ring-2 ring-cyan-400/30' : ''}`}
              >
                {service.popular && (
                  <div className='bg-cyan-400 text-black px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block'>
                    Popular
                  </div>
                )}

                <div className='text-4xl mb-4'>{service.icon}</div>

                <h3 className='text-xl font-bold text-white mb-3'>
                  {service.title}
                </h3>

                <p className='text-gray-300 mb-4 leading-relaxed'>
                  {service.description}
                </p>

                <div className='space-y-2 mb-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Pricing:</span>
                    <span className='text-cyan-400 font-semibold'>
                      {service.pricing}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Timeline:</span>
                    <span className='text-white'>{service.timeline}</span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  {service.technologies.slice(0, 3).map(tech => (
                    <span
                      key={tech}
                      className='bg-cyan-400/10 text-cyan-400 px-2 py-1 rounded text-xs'
                    >
                      {tech}
                    </span>
                  ))}
                  {service.technologies.length > 3 && (
                    <span className='text-gray-400 text-xs'>
                      +{service.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Service Details */}
      {selectedServiceData && (
        <section className='px-6 pb-16'>
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8'>
              <div className='grid lg:grid-cols-3 gap-8'>
                <div>
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='text-5xl'>{selectedServiceData.icon}</div>
                    <div>
                      <h3 className='text-3xl font-bold text-white'>
                        {selectedServiceData.title}
                      </h3>
                      <p className='text-cyan-400 text-lg'>
                        {selectedServiceData.pricing}
                      </p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6 leading-relaxed text-lg'>
                    {selectedServiceData.description}
                  </p>

                  <div className='mb-6'>
                    <h4 className='text-xl font-semibold text-white mb-4'>
                      What&apos;s Included:
                    </h4>
                    <ul className='space-y-2'>
                      {selectedServiceData.features.map((feature, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          <span className='text-cyan-400'>✓</span>
                          <span className='text-gray-300'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='mb-6'>
                    <h4 className='text-xl font-semibold text-white mb-4'>
                      Technologies Used:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {selectedServiceData.technologies.map(tech => (
                        <span
                          key={tech}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full text-sm'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='space-y-6'>
                  <div className='bg-white/5 border border-cyan-400/20 rounded-xl p-6'>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Project Timeline
                    </h4>
                    <p className='text-cyan-400 text-xl font-bold'>
                      {selectedServiceData.timeline}
                    </p>
                  </div>

                  <div className='bg-white/5 border border-cyan-400/20 rounded-xl p-6'>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Investment
                    </h4>
                    <p className='text-cyan-400 text-xl font-bold'>
                      {selectedServiceData.pricing}
                    </p>
                  </div>

                  <button className='w-full bg-cyan-400 text-black py-4 rounded-lg font-bold text-lg hover:bg-cyan-300 transition-colors'>
                    Get Started
                  </button>

                  <button className='w-full border-2 border-cyan-400 text-cyan-400 py-4 rounded-lg font-bold text-lg hover:bg-cyan-400 hover:text-black transition-colors'>
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className='px-6 pb-16'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-white mb-12 text-center'>
            My Development Process
          </h2>
          <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {process.map(step => (
              <div
                key={step.step}
                className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:bg-white/10 transition-colors'
              >
                <div className='flex items-center space-x-4 mb-4'>
                  <div className='w-12 h-12 bg-cyan-400 text-black rounded-full flex items-center justify-center font-bold text-lg'>
                    {step.step}
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white'>
                      {step.title}
                    </h3>
                    <p className='text-cyan-400 text-sm'>{step.duration}</p>
                  </div>
                </div>

                <p className='text-gray-300 mb-4 leading-relaxed'>
                  {step.description}
                </p>

                <div>
                  <h4 className='text-sm font-semibold text-white mb-2'>
                    Deliverables:
                  </h4>
                  <ul className='space-y-1'>
                    {step.deliverables.map((deliverable, index) => (
                      <li key={index} className='flex items-center space-x-2'>
                        <span className='text-cyan-400 text-xs'>•</span>
                        <span className='text-gray-400 text-sm'>
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='px-6 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-white mb-12 text-center'>
            What Clients Say
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:bg-white/10 transition-colors'
              >
                <div className='flex items-center space-x-1 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className='text-yellow-400'>
                      ★
                    </span>
                  ))}
                </div>

                <p className='text-gray-300 mb-6 leading-relaxed italic'>
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className='border-t border-gray-700 pt-4'>
                  <p className='text-white font-semibold'>{testimonial.name}</p>
                  <p className='text-cyan-400 text-sm'>{testimonial.role}</p>
                  <p className='text-gray-400 text-xs mt-1'>
                    {testimonial.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
