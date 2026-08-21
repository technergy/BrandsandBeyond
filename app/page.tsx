import { Navbar, Footer, Ticker } from '@/components/ui';
import Hero from '@/components/hero';
import { Story, People, Experience, Audience, Schedule, Packages } from '@/components/sections';
import Preloader from '@/components/preloader';

export default function Home() {
  return (
    <Preloader>
      <main className="overflow-x-hidden font-sans bg-brand-cream text-brand-ink selection:bg-brand-magenta selection:text-white">
        <Navbar />
        <Hero />
        <Ticker />
        <Story />
        <People />
        <Experience />
        <Audience />
        <Schedule />
        <Packages />
        <Footer />
      </main>
    </Preloader>
  );
}
