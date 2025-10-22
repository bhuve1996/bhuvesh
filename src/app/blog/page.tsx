'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Building Modern Web Applications with Next.js 15',
      excerpt:
        'Learn how to leverage the latest features in Next.js 15 to build performant and scalable web applications.',
      content:
        "Next.js 15 brings exciting new features including improved performance, better developer experience, and enhanced security. In this comprehensive guide, we'll explore how to build modern web applications using the latest version of Next.js...",
      category: 'Web Development',
      date: '2024-01-15',
      readTime: '8 min read',
      tags: ['Next.js', 'React', 'JavaScript', 'Web Development'],
      featured: true,
    },
    {
      id: 2,
      title: 'Mastering TypeScript for Large-Scale Applications',
      excerpt:
        'Discover best practices for using TypeScript in enterprise-level applications and how it improves code quality.',
      content:
        'TypeScript has become the standard for large-scale JavaScript applications. This article covers advanced TypeScript patterns, type safety strategies, and how to maintain clean, scalable code...',
      category: 'Programming',
      date: '2024-01-10',
      readTime: '12 min read',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
      featured: false,
    },
    {
      id: 3,
      title:
        'The Future of Web Development: AI and Machine Learning Integration',
      excerpt:
        'Exploring how AI and ML are revolutionizing web development and what developers need to know.',
      content:
        'Artificial Intelligence is transforming how we build and interact with web applications. From automated code generation to intelligent user interfaces, AI is reshaping the development landscape...',
      category: 'AI & ML',
      date: '2024-01-05',
      readTime: '10 min read',
      tags: ['AI', 'Machine Learning', 'Web Development', 'Future Tech'],
      featured: true,
    },
    {
      id: 4,
      title: 'Optimizing React Performance: A Complete Guide',
      excerpt:
        'Learn advanced techniques to optimize React applications for better performance and user experience.',
      content:
        'Performance optimization is crucial for React applications. This guide covers memoization, code splitting, lazy loading, and other advanced techniques to make your React apps lightning fast...',
      category: 'Web Development',
      date: '2024-01-01',
      readTime: '15 min read',
      tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
      featured: false,
    },
    {
      id: 5,
      title: 'Building Accessible Web Applications',
      excerpt:
        'A comprehensive guide to creating web applications that are accessible to all users, including those with disabilities.',
      content:
        'Web accessibility is not just a legal requirement but a moral imperative. Learn how to build applications that work for everyone, including users with visual, auditory, motor, and cognitive disabilities...',
      category: 'Accessibility',
      date: '2023-12-28',
      readTime: '9 min read',
      tags: ['Accessibility', 'Web Development', 'UX', 'Inclusive Design'],
      featured: false,
    },
    {
      id: 6,
      title: 'My Journey from Designer to Full-Stack Developer',
      excerpt:
        'Personal insights and lessons learned while transitioning from design to development.',
      content:
        "Transitioning from design to development was one of the most challenging yet rewarding decisions of my career. Here's what I learned along the way and how it shaped my approach to building digital products...",
      category: 'Career',
      date: '2023-12-20',
      readTime: '6 min read',
      tags: ['Career', 'Personal', 'Design', 'Development'],
      featured: true,
    },
  ];

  const categories = [
    'all',
    'Web Development',
    'Programming',
    'AI & ML',
    'Accessibility',
    'Career',
  ];

  const filteredPosts =
    selectedCategory === 'all'
      ? blogPosts
      : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border'>
        <div className='max-w-6xl mx-auto px-6 py-4 mt-8'>
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
              <span className='text-cyan-400'>Blog</span>
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
            My Blog
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Thoughts, tutorials, and insights about web development, technology,
            and the journey of building digital experiences.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className='px-6 pb-16'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-white mb-8'>
            Featured Articles
          </h2>
          <div className='grid md:grid-cols-3 lg:grid-cols-4 gap-8'>
            {featuredPosts.map(post => (
              <article
                key={post.id}
                className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-card/10 transition-colors group cursor-pointer'
              >
                <div className='mb-4'>
                  <span className='bg-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-semibold'>
                    {post.category}
                  </span>
                </div>

                <h3 className='text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors'>
                  {post.title}
                </h3>

                <p className='text-gray-300 mb-4 leading-relaxed'>
                  {post.excerpt}
                </p>

                <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>

                <div className='flex flex-wrap gap-2 mb-4'>
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className='bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs'
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className='text-cyan-400 hover:text-cyan-300 font-semibold transition-colors'>
                  Read More →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className='px-6 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Sidebar */}
            <div className='md:w-1/4'>
              <div className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-6 sticky top-32'>
                <h3 className='text-xl font-bold text-foreground mb-4'>
                  Categories
                </h3>
                <div className='space-y-2'>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-cyan-400/20 text-cyan-400'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className='md:w-3/4'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
              </h2>

              <div className='space-y-8'>
                {filteredPosts.map(post => (
                  <article
                    key={post.id}
                    className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 hover:bg-white/10 transition-colors group cursor-pointer'
                  >
                    <div className='flex flex-col md:flex-row gap-6'>
                      <div className='md:w-2/3'>
                        <div className='flex items-center gap-4 mb-4'>
                          <span className='bg-cyan-400/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-semibold'>
                            {post.category}
                          </span>
                          {post.featured && (
                            <span className='bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold'>
                              Featured
                            </span>
                          )}
                        </div>

                        <h3 className='text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors'>
                          {post.title}
                        </h3>

                        <p className='text-gray-300 mb-4 leading-relaxed'>
                          {post.excerpt}
                        </p>

                        <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>

                        <div className='flex flex-wrap gap-2 mb-4'>
                          {post.tags.map(tag => (
                            <span
                              key={tag}
                              className='bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button className='text-cyan-400 hover:text-cyan-300 font-semibold transition-colors'>
                          Read Full Article →
                        </button>
                      </div>

                      <div className='md:w-1/3 flex items-center justify-center'>
                        <div className='w-full h-48 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-cyan-400/20'>
                          <span className='text-4xl'>📝</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
