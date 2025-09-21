import React from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/SVG';

export const ContactSection: React.FC = () => {
  return (
    <Section
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
          <Card>
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

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-8">
            <Card>
              <h3 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                    <Icons.Email className="text-cyan-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-300">Email</p>
                    <p className="text-white">bhuvesh@example.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center">
                    <Icons.Location className="text-cyan-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-300">Location</p>
                    <p className="text-white">Your City, Country</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-white mb-6">Follow Me</h3>
              <div className="flex space-x-4">
                {[
                  { name: 'GitHub', icon: Icons.GitHub },
                  { name: 'LinkedIn', icon: Icons.LinkedIn },
                  { name: 'Twitter', icon: Icons.Twitter },
                ].map((social) => (
                  <button
                    key={social.name}
                    className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-6 py-3 rounded-lg hover:bg-cyan-400/20 transition-colors flex items-center space-x-2"
                  >
                    <social.icon className="w-5 h-5" />
                    <span>{social.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
