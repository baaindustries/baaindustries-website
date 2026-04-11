import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import BuildWithUs from '@/components/BuildWithUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <BuildWithUs />
      <Footer />
    </main>
  );
}
