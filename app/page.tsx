import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import BuildWithUs from '@/components/BuildWithUs';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <BuildWithUs />
      <Footer />
    </main>
  );
}
