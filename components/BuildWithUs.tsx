import Link from 'next/link';

const services = [
  {
    icon: '🔬',
    title: 'PCB Manufacturing',
    description: 'Custom PCB design and manufacturing with fast turnaround. From prototype to production runs.',
    features: ['1–32 layer boards', 'Express 24hr turnaround', 'SMT assembly available'],
    cta: 'Get PCB Quote',
    href: '/build-with-us',
  },
  {
    icon: '🖨️',
    title: '3D Printing',
    description: 'FDM and resin 3D printing for enclosures, prototypes, and custom mechanical parts.',
    features: ['FDM & Resin options', 'Multiple materials', 'Finishing & painting'],
    cta: 'Get Instant Quote',
    href: '/3d-printing',
  },
  {
    icon: '✂️',
    title: 'Laser Cutting',
    description: 'Precision laser cutting for acrylic, wood, metal sheets, and custom panels.',
    features: ['Acrylic, wood & metal', 'Custom dimensions', 'Engraving available'],
    cta: 'Get Laser Quote',
    href: '/build-with-us',
  },
  {
    icon: '🔋',
    title: 'Custom Battery Packs',
    description: 'Bespoke battery pack design and assembly for drones, robots, and industrial applications.',
    features: ['Li-Ion & LiPo options', 'Custom voltage & capacity', 'BMS integration'],
    cta: 'Get Battery Quote',
    href: '/build-with-us',
  },
];

export default function BuildWithUs() {
  return (
    <section id="build-with-us" className="bg-[#F9F9F9] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F5C100]/20 border border-[#F5C100] text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            ⚡ Manufacturing Services
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#111111] mb-4">
            Build With Us
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From idea to finished product. Our India-based manufacturing partners deliver professional-grade results at competitive prices — shipped directly to your door.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white border-2 border-gray-100 hover:border-[#F5C100] rounded-2xl p-6 flex flex-col gap-4 group transition-all hover:shadow-lg"
            >
              <div className="text-4xl">{service.icon}</div>
              <div>
                <h3 className="text-[#111111] font-bold text-lg mb-1">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
              <ul className="space-y-1.5">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-[#F5C100] font-bold text-base">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="mt-auto text-center border-2 border-[#111111] hover:bg-[#F5C100] hover:border-[#F5C100] text-[#111111] text-sm font-bold py-2.5 rounded-lg transition-all"
              >
                {service.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-[#111111] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Need a custom solution?</h3>
            <p className="text-gray-400 text-sm">Tell us what you need and our team will get back to you within 24 hours.</p>
          </div>
          <Link
            href="/build-with-us"
            className="flex-shrink-0 bg-[#F5C100] hover:bg-[#e0b000] transition-colors text-[#111111] font-bold px-8 py-3 rounded-lg whitespace-nowrap"
          >
            Start a Project →
          </Link>
        </div>
      </div>
    </section>
  );
}
