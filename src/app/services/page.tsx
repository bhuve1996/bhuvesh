'use client';

import { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { AnimatedSection } from '@/components/common';
import { PageLayout } from '@/components/layout';
import { Card } from '@/components/ui/Card';

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
    <PageLayout
      title='My Services'
      description='Comprehensive web development and technology solutions to bring your ideas to life.'
    >
      {/* Services Grid */}
      <section className='px-6 pb-16' aria-labelledby='services-title'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {services.map((service, index) => (
              <AnimatedSection
                key={service.id}
                animation='slideUp'
                delay={index * 100}
              >
                <Card
                  onClick={() => setSelectedService(service.id)}
                  className={`cursor-pointer transition-all duration-300 group ${
                    selectedService === service.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-neutral-800 hover:border-primary-500/50 hover:bg-neutral-800/50'
                  } ${service.popular ? 'ring-2 ring-primary-500/30' : ''}`}
                  role='button'
                  tabIndex={0}
                  aria-pressed={selectedService === service.id}
                  aria-label={`Select ${service.title} service`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedService(service.id);
                    }
                  }}
                >
                  {service.popular && (
                    <div
                      className='bg-primary-500 text-primary-950 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block'
                      role='status'
                      aria-label='Popular service'
                    >
                      Popular
                    </div>
                  )}

                  <div className='flex items-center mb-4'>
                    <div className='w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mr-4'>
                      <span className='text-2xl'>{service.icon}</span>
                    </div>
                    <h3 className='text-xl font-bold text-foreground group-hover:text-primary-400 transition-colors'>
                      {service.title}
                    </h3>
                  </div>

                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    {service.description}
                  </p>

                  <div className='space-y-3 mb-6'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Pricing:</span>
                      <span className='text-primary-400 font-semibold'>
                        {service.pricing}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-muted-foreground'>Timeline:</span>
                      <span className='text-foreground'>
                        {service.timeline}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {service.technologies.slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className='bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-lg text-xs font-medium'
                      >
                        {tech}
                      </span>
                    ))}
                    {service.technologies.length > 3 && (
                      <span className='text-muted-foreground text-xs'>
                        +{service.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Service Details */}
      {selectedServiceData && (
        <section
          className='px-6 pb-16'
          aria-labelledby='selected-service-title'
        >
          <div className='max-w-7xl mx-auto'>
            <Card className='animate-slide-up'>
              <div className='grid lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2'>
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='w-16 h-16 bg-primary-500/10 rounded-lg flex items-center justify-center'>
                      <span className='text-3xl'>
                        {selectedServiceData.icon}
                      </span>
                    </div>
                    <div>
                      <h3
                        id='selected-service-title'
                        className='text-3xl font-bold text-foreground'
                      >
                        {selectedServiceData.title}
                      </h3>
                      <p className='text-primary-400 text-lg font-semibold'>
                        {selectedServiceData.pricing}
                      </p>
                    </div>
                  </div>

                  <p className='text-neutral-300 mb-6 leading-relaxed text-lg'>
                    {selectedServiceData.description}
                  </p>

                  <div className='mb-6'>
                    <h4 className='text-xl font-semibold text-foreground mb-4'>
                      What&apos;s Included:
                    </h4>
                    <ul className='space-y-3'>
                      {selectedServiceData.features.map((feature, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          <span className='text-primary-400 text-lg'>✓</span>
                          <span className='text-muted-foreground'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='mb-6'>
                    <h4 className='text-xl font-semibold text-foreground mb-4'>
                      Technologies Used:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {selectedServiceData.technologies.map(tech => (
                        <span
                          key={tech}
                          className='bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-lg text-sm font-medium'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='space-y-6'>
                  <Card className='bg-primary-500/5 border-primary-500/20'>
                    <h4 className='text-lg font-semibold text-foreground mb-3'>
                      Project Timeline
                    </h4>
                    <p className='text-primary-400 text-xl font-bold'>
                      {selectedServiceData.timeline}
                    </p>
                  </Card>

                  <Card className='bg-secondary-500/5 border-secondary-500/20'>
                    <h4 className='text-lg font-semibold text-foreground mb-3'>
                      Investment
                    </h4>
                    <p className='text-secondary-400 text-xl font-bold'>
                      {selectedServiceData.pricing}
                    </p>
                  </Card>

                  <Button
                    size='lg'
                    className='w-full'
                    aria-label='Get started with this service'
                  >
                    Get Started
                  </Button>

                  <Button
                    variant='outline'
                    size='lg'
                    className='w-full'
                    aria-label='Schedule a consultation for this service'
                  >
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className='px-6 pb-16' aria-labelledby='process-title'>
        <div className='max-w-7xl mx-auto'>
          <h2
            id='process-title'
            className='section-title text-center animate-slide-up'
          >
            My Development Process
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {process.map((step, index) => (
              <AnimatedSection
                key={step.step}
                animation='slideUp'
                delay={index * 100}
              >
                <Card className='card-hover'>
                  <div className='flex items-center space-x-4 mb-6'>
                    <div className='w-12 h-12 bg-primary-500 text-primary-950 rounded-full flex items-center justify-center font-bold text-lg'>
                      {step.step}
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-foreground'>
                        {step.title}
                      </h3>
                      <p className='text-primary-400 text-sm font-medium'>
                        {step.duration}
                      </p>
                    </div>
                  </div>

                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    {step.description}
                  </p>

                  <div>
                    <h4 className='text-sm font-semibold text-foreground mb-3'>
                      Deliverables:
                    </h4>
                    <ul className='space-y-2'>
                      {step.deliverables.map((deliverable, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          <span className='text-primary-400 text-sm'>•</span>
                          <span className='text-muted-foreground text-sm'>
                            {deliverable}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='px-6 pb-20' aria-labelledby='testimonials-title'>
        <div className='max-w-7xl mx-auto'>
          <h2
            id='testimonials-title'
            className='section-title text-center animate-slide-up'
          >
            What Clients Say
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <AnimatedSection
                key={testimonial.id}
                animation='slideUp'
                delay={index * 100}
              >
                <Card
                  className='card-hover'
                  role='article'
                  aria-labelledby={`testimonial-${testimonial.id}-name`}
                >
                  <div className='flex items-center space-x-1 mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className='text-accent-400 text-lg'>
                        ★
                      </span>
                    ))}
                  </div>

                  <p className='text-muted-foreground mb-6 leading-relaxed italic'>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className='border-t border-neutral-700 pt-4'>
                    <p
                      id={`testimonial-${testimonial.id}-name`}
                      className='text-foreground font-semibold'
                    >
                      {testimonial.name}
                    </p>
                    <p className='text-primary-400 text-sm'>
                      {testimonial.role}
                    </p>
                    <p className='text-muted-foreground text-xs mt-1'>
                      {testimonial.project}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
