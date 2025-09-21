import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { projects } from '@/lib/data';

export const ProjectsSection: React.FC = () => {
  return (
    <Section
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
          {projects.map((project) => (
            <Card key={project.id} className="group">
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
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ProjectsSection;
