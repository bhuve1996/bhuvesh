import React from 'react';

interface StructuredDataProps {
  type?: 'Person' | 'Organization' | 'WebSite';
  data?: Record<string, unknown>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'Person',
  data,
}) => {
  const defaultPersonData = {
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
  };

  const defaultWebsiteData = {
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
  };

  const getStructuredData = () => {
    if (data) return data;

    switch (type) {
      case 'Person':
        return defaultPersonData;
      case 'WebSite':
        return defaultWebsiteData;
      default:
        return defaultPersonData;
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

export default StructuredData;
