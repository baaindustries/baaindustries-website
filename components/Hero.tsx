import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#00C2FF 1px, transparent 1px), linear-gradient(90deg, #00C2FF 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00C2FF] opacity-5 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">

        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#00C2FF] rounded-full animate-pulse"></span>
            Trusted by Engineers & Makers Worldwide
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Everything You Need<br />
            to <span className="text-[#00C2FF]">Build & Innovate</span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            Premium robotics components, electronics kits, and custom manufacturing services — shipped from India to the US & Europe.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/shop"
              className="bg-[#00C2FF] hover:bg-[#00a8e0] transition-colors text-[#0A0A0A] font-bold px-8 py-3.5 rounded-lg text-base"
            >
              Shop Now →
            </Link>
            <Link
              href="/build-with-us"
              className="border border-[#333] hover:border-[#00C2FF] transition-colors text-white px-8 py-3.5 rounded-lg text-base font-semibold"
            >
              Build With Us
            </Link>
            <Link
              href="/bulk-enquiry"
              className="border border-[#333] hover:border-[#00C2FF] transition-colors text-gray-400 hover:text-white px-8 py-3.5 rounded-lg text-base"
            >
              Bulk / B2B Orders
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-[#00C2FF] text-lg">✓</span> 10,000+ Products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00C2FF] text-lg">✓</span> Ships to US & EU
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00C2FF] text-lg">✓</span> Business Invoicing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00C2FF] text-lg">✓</span> Custom Manufacturing
            </div>
          </div>
        </div>

        {/* Right: Visual cards */}
        <div className="flex-1 grid grid-cols-2 gap-3 max-w-md w-full">
          {[
            { icon: '🤖', label: 'Microcontrollers', count: '500+ products', color: '#00C2FF' },
            { icon: '⚙️', label: 'Motors & Drives', count: '800+ products', color: '#7C3AED' },
            { icon: '📡', label: 'Sensors', count: '1,200+ products', color: '#059669' },
            { icon: '🚁', label: 'Drones & FPV', count: '300+ products', color: '#DC2626' },
            { icon: '🔋', label: 'Power Systems', count: '400+ products', color: '#D97706' },
            { icon: '📦', label: 'Kits & Bundles', count: '150+ kits', color: '#00C2FF' },
          ].map((item) => (
            <Link
              href="#"
              key={item.label}
              className="bg-[#111111] border border-[#222] hover:border-[#333] rounded-xl p-4 flex flex-col gap-2 group transition-all hover:bg-[#141414]"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-white text-sm font-semibold group-hover:text-[#00C2FF] transition-colors">{item.label}</span>
              <span className="text-gray-500 text-xs">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
