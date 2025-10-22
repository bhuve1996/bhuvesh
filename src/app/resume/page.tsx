'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Resume() {
  const [activeTab, setActiveTab] = useState('experience');

  const experience = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      period: '2022 - Present',
      type: 'Full-time',
      description:
        'Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices.',
      achievements: [
        'Increased application performance by 40% through optimization',
        'Led a team of 5 developers on major product launches',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored 3 junior developers to senior level',
      ],
      technologies: [
        'React',
        'Node.js',
        'TypeScript',
        'AWS',
        'Docker',
        'Kubernetes',
      ],
    },
    {
      id: 2,
      title: 'Full-Stack Developer',
      company: 'Digital Solutions Ltd.',
      location: 'New York, NY',
      period: '2020 - 2022',
      type: 'Full-time',
      description:
        'Developed and maintained multiple web applications for clients across various industries. Collaborated with design teams to create user-friendly interfaces.',
      achievements: [
        'Built 15+ client applications with 99.9% uptime',
        'Reduced bug reports by 50% through improved testing',
        'Implemented responsive designs for mobile-first approach',
        'Collaborated with 10+ cross-functional teams',
      ],
      technologies: [
        'React',
        'Vue.js',
        'Python',
        'PostgreSQL',
        'MongoDB',
        'Redis',
      ],
    },
    {
      id: 3,
      title: 'Frontend Developer',
      company: 'Creative Agency Pro',
      location: 'Los Angeles, CA',
      period: '2019 - 2020',
      type: 'Full-time',
      description:
        'Specialized in creating interactive and responsive user interfaces. Worked closely with designers to bring creative visions to life.',
      achievements: [
        'Created 20+ responsive websites with modern animations',
        'Improved page load speeds by 35%',
        'Implemented accessibility standards (WCAG 2.1)',
        'Collaborated with 5+ design teams',
      ],
      technologies: [
        'JavaScript',
        'React',
        'Sass',
        'Webpack',
        'Figma',
        'Adobe Creative Suite',
      ],
    },
    {
      id: 4,
      title: 'Junior Web Developer',
      company: 'StartupHub',
      location: 'Austin, TX',
      period: '2018 - 2019',
      type: 'Full-time',
      description:
        'Started my professional journey building web applications and learning modern development practices in a fast-paced startup environment.',
      achievements: [
        'Built first production application from scratch',
        'Learned agile development methodologies',
        'Contributed to open-source projects',
        'Completed 50+ code reviews',
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap', 'Git'],
    },
  ];

  const education = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      period: '2014 - 2018',
      gpa: '3.8/4.0',
      relevant_courses: [
        'Data Structures and Algorithms',
        'Software Engineering',
        'Database Systems',
        'Web Development',
        'Machine Learning',
      ],
    },
    {
      id: 2,
      degree: 'Full-Stack Web Development Bootcamp',
      school: 'General Assembly',
      location: 'San Francisco, CA',
      period: '2018',
      gpa: 'Graduated with Honors',
      relevant_courses: [
        'React and Redux',
        'Node.js and Express',
        'MongoDB and SQL',
        'RESTful APIs',
        'Agile Development',
      ],
    },
  ];

  const certifications = [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      credential_id: 'AWS-CSA-123456',
      link: '#',
    },
    {
      id: 2,
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2022',
      credential_id: 'GCP-PD-789012',
      link: '#',
    },
    {
      id: 3,
      name: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
      credential_id: 'CKA-345678',
      link: '#',
    },
    {
      id: 4,
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '2021',
      credential_id: 'META-REACT-901234',
      link: '#',
    },
  ];

  const skills = {
    Frontend: [
      'React',
      'Next.js',
      'Vue.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Sass',
      'Figma',
    ],
    Backend: [
      'Node.js',
      'Python',
      'Express.js',
      'Django',
      'FastAPI',
      'REST APIs',
      'GraphQL',
      'Microservices',
    ],
    Database: [
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'MySQL',
      'Firebase',
      'Supabase',
    ],
    'Cloud & DevOps': [
      'AWS',
      'Google Cloud',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Terraform',
      'Jenkins',
    ],
    'Tools & Others': [
      'Git',
      'GitHub',
      'VS Code',
      'Webpack',
      'Vite',
      'Jest',
      'Cypress',
      'Postman',
    ],
  };

  return (
    <div className='min-h-screen bg-background text-foreground relative overflow-hidden'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground font-bold text-lg'>
                  B
                </span>
              </div>
              <span className='text-xl font-bold text-foreground'>Bhuvesh</span>
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
              <span className='text-cyan-400'>Resume</span>
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
            My Resume
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Professional experience, education, and skills in web development
            and software engineering.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/resume/builder'
              className='bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-cyan-300 transition-colors text-center'
            >
              Build Your Resume
            </Link>
            <Link
              href='/resume/ats-checker'
              className='border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-colors text-center'
            >
              ATS Checker
            </Link>
            <button className='border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-colors'>
              Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className='px-6 pb-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center'>
            <div className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-2'>
              {[
                { id: 'experience', label: 'Experience' },
                { id: 'education', label: 'Education' },
                { id: 'skills', label: 'Skills' },
                { id: 'certifications', label: 'Certifications' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-400 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='px-6 pb-20'>
        <div className='max-w-6xl mx-auto'>
          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Professional Experience
              </h2>
              {experience.map(job => (
                <div
                  key={job.id}
                  className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                >
                  <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-4'>
                    <div>
                      <h3 className='text-2xl font-bold text-white mb-2'>
                        {job.title}
                      </h3>
                      <p className='text-xl text-cyan-400 mb-1'>
                        {job.company}
                      </p>
                      <p className='text-gray-400'>{job.location}</p>
                    </div>
                    <div className='text-right mt-4 md:mt-0'>
                      <p className='text-white font-semibold'>{job.period}</p>
                      <p className='text-gray-400'>{job.type}</p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6 leading-relaxed'>
                    {job.description}
                  </p>

                  <div className='mb-6'>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Key Achievements:
                    </h4>
                    <ul className='space-y-2'>
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} className='flex items-start space-x-3'>
                          <span className='text-cyan-400 mt-1'>•</span>
                          <span className='text-gray-300'>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Technologies Used:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {job.technologies.map(tech => (
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
              ))}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>Education</h2>
              {education.map(edu => (
                <div
                  key={edu.id}
                  className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                >
                  <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-4'>
                    <div>
                      <h3 className='text-2xl font-bold text-white mb-2'>
                        {edu.degree}
                      </h3>
                      <p className='text-xl text-cyan-400 mb-1'>{edu.school}</p>
                      <p className='text-gray-400'>{edu.location}</p>
                    </div>
                    <div className='text-right mt-4 md:mt-0'>
                      <p className='text-white font-semibold'>{edu.period}</p>
                      <p className='text-gray-400'>{edu.gpa}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Relevant Coursework:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {edu.relevant_courses.map(course => (
                        <span
                          key={course}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full text-sm'
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Technical Skills
              </h2>
              <div className='grid md:grid-cols-3 gap-8'>
                {Object.entries(skills).map(([category, skillList]) => (
                  <div
                    key={category}
                    className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                  >
                    <h3 className='text-xl font-bold text-white mb-6'>
                      {category}
                    </h3>
                    <div className='flex flex-wrap gap-3'>
                      {skillList.map(skill => (
                        <span
                          key={skill}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-400/20 transition-colors cursor-pointer'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Certifications
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                {certifications.map(cert => (
                  <div
                    key={cert.id}
                    className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-pointer'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-1'>
                          {cert.name}
                        </h3>
                        <p className='text-cyan-400'>{cert.issuer}</p>
                      </div>
                      <span className='text-gray-400 text-sm'>{cert.date}</span>
                    </div>

                    <p className='text-gray-300 text-sm mb-4'>
                      Credential ID: {cert.credential_id}
                    </p>

                    <button className='text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors'>
                      View Credential →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
