import React from 'react';

interface EnhancedStructuredDataProps {
  type?:
    | 'Person'
    | 'Organization'
    | 'WebSite'
    | 'BlogPosting'
    | 'Service'
    | 'Resume';
  data?: Record<string, unknown>;
}

export const EnhancedStructuredData: React.FC<EnhancedStructuredDataProps> = ({
  type = 'Person',
  data,
}) => {
  const getPersonData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bhuvesh Singla',
    jobTitle: 'Full-Stack Developer',
    description:
      'Experienced Full-Stack Developer with 7+ years of expertise in React, Next.js, TypeScript, and modern web technologies.',
    url: 'https://bhuvesh.com',
    image: 'https://bhuvesh.com/logo.png',
    sameAs: [
      'https://github.com/bhuvesh-singla',
      'https://linkedin.com/in/bhuvesh-singla',
      'https://twitter.com/bhuvesh_singla',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Web Development',
      'Frontend Development',
      'Backend Development',
      'Full-Stack Development',
      'UI/UX Design',
      'Mobile Development',
      'Cloud Computing',
      'DevOps',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full-Stack Developer',
      description: 'Developing web applications using modern technologies',
      skills: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Node.js',
        'Python',
        'AWS',
        'Docker',
        'Kubernetes',
      ],
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University of California, Berkeley',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Tech Innovations Inc.',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    email: 'contact@bhuvesh.com',
    telephone: '+1-555-123-4567',
  });

  const getWebsiteData = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bhuvesh Singla Portfolio',
    url: 'https://bhuvesh.com',
    description:
      'Full-Stack Developer Portfolio showcasing modern web development projects and services.',
    author: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://bhuvesh.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
  });

  const getOrganizationData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bhuvesh Singla - Full-Stack Developer',
    url: 'https://bhuvesh.com',
    logo: 'https://bhuvesh.com/logo.png',
    description: 'Professional web development services and consulting',
    founder: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'contact@bhuvesh.com',
    },
    sameAs: [
      'https://github.com/bhuvesh-singla',
      'https://linkedin.com/in/bhuvesh-singla',
      'https://twitter.com/bhuvesh_singla',
    ],
  });

  const getServiceData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Web Development Services',
    description:
      'Professional web development services including React applications, Next.js websites, mobile apps, and e-commerce solutions.',
    provider: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    serviceType: 'Web Development',
    areaServed: 'Worldwide',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://bhuvesh.com/contact',
      serviceName: 'Contact Form',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Web Development',
        description: 'Custom web applications built with modern technologies',
        price: '2500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications',
        price: '5000',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Technical Consulting',
        description: 'Expert guidance on technology decisions and architecture',
        price: '150',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '150',
          priceCurrency: 'USD',
          unitText: 'hour',
        },
      },
    ],
  });

  const getResumeData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Resume',
    name: 'Bhuvesh Singla Resume',
    description: 'Professional resume of Bhuvesh Singla, Full-Stack Developer',
    author: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    about: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
      jobTitle: 'Full-Stack Developer',
    },
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
    ],
  });

  const getBlogPostingData = () => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Web Development Insights and Tutorials',
    description:
      'Blog posts about web development, React, Next.js, and modern web technologies',
    author: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    publisher: {
      '@type': 'Person',
      name: 'Bhuvesh Singla',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    url: 'https://bhuvesh.com/blog',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://bhuvesh.com/blog',
    },
  });

  const getStructuredData = () => {
    if (data) return data;

    switch (type) {
      case 'Person':
        return getPersonData();
      case 'WebSite':
        return getWebsiteData();
      case 'Organization':
        return getOrganizationData();
      case 'Service':
        return getServiceData();
      case 'Resume':
        return getResumeData();
      case 'BlogPosting':
        return getBlogPostingData();
      default:
        return getPersonData();
    }
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  );
};

export default EnhancedStructuredData;
