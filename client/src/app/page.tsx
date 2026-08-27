import HeroSection from '@/components/HeroSection';
import Galaxy from '@/components/Galaxy';
import AboutSection from '@/components/home/AboutSection';
import EventsPreview from '@/components/home/EventsPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import BlogsPreview from '@/components/home/BlogsPreview';
import CosmosSection from '@/components/home/CosmosSection';
import NewsSection from '@/components/home/NewsSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <main className="relative">

      <div className="fixed inset-0 z-[-1] bg-[#050816]">
        <Galaxy 
          mouseRepulsion={true}
          mouseInteraction={true}
          density={1}
          glowIntensity={0.6} 
          saturation={1} 
          hueShift={-40} 
          twinkleIntensity={0.4}
          rotationSpeed={0.05}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
          transparent={true}
        />
      </div>

      <HeroSection />
      <CosmosSection />

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
