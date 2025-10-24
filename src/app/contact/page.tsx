'use client';

import { ContactSection } from '@/components/sections';
import { StructuredData } from '@/components/SEO/StructuredData';

export default function Contact() {
  return (
    <>
      <StructuredData type='Person' />
      <StructuredData type='WebSite' />
      <ContactSection />
    </>
  );
}
