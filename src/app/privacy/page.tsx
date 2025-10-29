import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "Privacy Policy for Bhuvesh Singla's portfolio website and services.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'>
      <div className='container mx-auto px-4 py-16 max-w-4xl'>
        <div className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-8 shadow-2xl'>
          <h1 className='text-4xl font-bold text-white mb-8 text-center'>
            Privacy Policy
          </h1>

          <div className='prose prose-invert max-w-none'>
            <p className='text-gray-300 text-lg mb-6'>
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                1. Information We Collect
              </h2>
              <p className='text-gray-300 mb-4'>
                We collect information you provide directly to us, such as when
                you:
              </p>
              <ul className='list-disc list-inside text-gray-300 space-y-2'>
                <li>Contact us through our contact form</li>
                <li>Use our resume builder or ATS checker services</li>
                <li>Subscribe to our newsletter</li>
                <li>Interact with our website features</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                2. How We Use Your Information
              </h2>
              <p className='text-gray-300 mb-4'>
                We use the information we collect to:
              </p>
              <ul className='list-disc list-inside text-gray-300 space-y-2'>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our website and user experience</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                3. Information Sharing
              </h2>
              <p className='text-gray-300 mb-4'>
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                4. Data Security
              </h2>
              <p className='text-gray-300 mb-4'>
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                5. Cookies and Tracking
              </h2>
              <p className='text-gray-300 mb-4'>
                We use cookies and similar tracking technologies to enhance your
                experience on our website. You can control cookie settings
                through your browser preferences.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                6. Third-Party Services
              </h2>
              <p className='text-gray-300 mb-4'>
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices of these external
                sites.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                7. Your Rights
              </h2>
              <p className='text-gray-300 mb-4'>You have the right to:</p>
              <ul className='list-disc list-inside text-gray-300 space-y-2'>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                8. Changes to This Policy
              </h2>
              <p className='text-gray-300 mb-4'>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this
                page.
              </p>
            </section>

            <section className='mb-8'>
              <h2 className='text-2xl font-semibold text-cyan-400 mb-4'>
                9. Contact Us
              </h2>
              <p className='text-gray-300 mb-4'>
                If you have any questions about this privacy policy, please
                contact us at:
              </p>
              <div className='bg-gray-800/50 p-4 rounded-lg'>
                <p className='text-gray-300'>
                  <strong>Email:</strong> contact@bhuvesh.com
                  <br />
                  <strong>Website:</strong> https://bhuvesh.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
