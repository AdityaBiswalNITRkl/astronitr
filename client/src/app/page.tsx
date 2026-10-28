import AboutSection from '@/components/home/AboutSection';
import EventsPreview from '@/components/home/EventsPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import BlogsPreview from '@/components/home/BlogsPreview';
import NewsSection from '@/components/home/NewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <main className="relative">
      <section id="about" className="relative z-10">
        <AboutSection />
      </section>
      <section id="events" className="relative z-10">
        <EventsPreview />
      </section>
      <section id="gallery" className="relative z-10">
        <GalleryPreview />
      </section>
      <section id="blog" className="relative z-10">
        <BlogsPreview />
      </section>
      <NewsSection />
      <section id="contact" className="relative z-10">
        <ContactSection />
      </section>
    </main>
  );
}