import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1E1E1E] pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Newsletter */}
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Stay ahead of the curve</h3>
            <p className="text-gray-400 text-sm">New products, exclusive deals, and engineering guides — straight to your inbox.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-[#1A1A1A] border border-[#333] text-white placeholder-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#00C2FF] flex-1 md:w-64"
            />
            <button className="bg-[#00C2FF] hover:bg-[#00a8e0] transition-colors text-[#0A0A0A] font-bold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-extrabold text-white">BAA<span className="text-[#00C2FF]">.</span></span>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">Premium robotics & electronics for engineers, makers, and businesses worldwide.</p>
            </div>
            <div className="flex gap-3">
              {['𝕏', 'in', 'yt', 'ig'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-[#1A1A1A] hover:bg-[#00C2FF] hover:text-[#0A0A0A] text-gray-400 rounded-lg flex items-center justify-center text-xs font-bold transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {['Microcontrollers', 'Motors & Drives', 'Sensors', 'Drones & FPV', 'Power & Batteries', 'Kits & Bundles', 'New Arrivals'].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {['PCB Manufacturing', '3D Printing', 'Laser Cutting', 'Custom Battery Packs', 'Bulk / B2B Orders', 'Bulk Enquiry'].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              {['Track My Order', 'Shipping Info', 'Returns & Refunds', 'FAQ', 'Contact Us', 'About BAA Industries'].map((item) => (
                <li key={item}><Link href="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E1E1E] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 BAA Industries. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Cookie Policy</Link>
          </div>
          <p>🌍 Shipping to US & EU from India</p>
        </div>
      </div>
    </footer>
  );
}
