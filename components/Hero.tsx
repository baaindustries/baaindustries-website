import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[#F5C100] overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">

        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#111111]/10 border border-[#111111]/20 text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-pulse"></span>
            Trusted by Engineers &amp; Makers Worldwide
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#111111] leading-tight mb-4">
            Everything You Need<br />
            to <span className="underline decoration-4 decoration-[#111111]">Build &amp; Innovate</span>
          </h1>

          <p className="text-[#333333] text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            Premium robotics components, electronics kits, and custom manufacturing services — delivered to the US &amp; Europe.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              href="/shop"
              className="bg-[#111111] hover:bg-[#333333] transition-colors text-white font-bold px-8 py-3.5 rounded-lg text-base"
            >
              Shop FPV Parts →
            </Link>
            <Link
              href="/#build-with-us"
              className="bg-white hover:bg-gray-50 border-2 border-[#111111] transition-colors text-[#111111] px-8 py-3.5 rounded-lg text-base font-bold"
            >
              Build With Us
            </Link>
            <Link
              href="/bulk-enquiry"
              className="border-2 border-[#111111]/40 hover:border-[#111111] transition-colors text-[#333333] hover:text-[#111111] px-8 py-3.5 rounded-lg text-base font-semibold"
            >
              Bulk / B2B Orders
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start text-sm text-[#333333]">
            <div className="flex items-center gap-2">
              <span className="text-[#111111] text-lg font-bold">✓</span> 10,000+ Products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#111111] text-lg font-bold">✓</span> Ships to US &amp; EU
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#111111] text-lg font-bold">✓</span> Business Invoicing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#111111] text-lg font-bold">✓</span> Custom Manufacturing
            </div>
          </div>
        </div>

        {/* Right: Visual cards — matches navbar categories */}
        <div className="flex-1 grid grid-cols-2 gap-3 max-w-md w-full">
          {[
            { icon: '⚙️', label: 'Motors',             href: '/shop?category=Motors',             count: 'Brushless & servo' },
            { icon: '📡', label: 'Sensors',             href: '/shop?category=Sensors',            count: 'IMU, LiDAR & more' },
            { icon: '🖥️', label: 'Development Boards',  href: '/shop?category=Development+Boards', count: 'Arduino, STM32 & more' },
            { icon: '🖨️', label: '3D Printer Parts',    href: '/shop?category=3D+Printer+Parts',   count: 'Hotends, frames & more' },
          ].map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="bg-white border-2 border-[#111111]/10 hover:border-[#111111] rounded-xl p-4 flex flex-col gap-2 group transition-all hover:shadow-lg"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[#111111] text-sm font-bold">{item.label}</span>
              <span className="text-gray-500 text-xs">{item.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
