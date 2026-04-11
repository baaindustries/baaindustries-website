import Link from 'next/link';

const products = [
  { id: 1, name: 'Arduino Uno R4 WiFi', category: 'Microcontrollers', price: 27.50, originalPrice: 35.00, badge: 'Best Seller', emoji: '🤖' },
  { id: 2, name: 'Raspberry Pi 5 (4GB)', category: 'Single Board Computers', price: 60.00, originalPrice: null, badge: 'New', emoji: '💻' },
  { id: 3, name: 'BLDC Motor 2212 1000KV', category: 'Motors & Drives', price: 12.99, originalPrice: 18.00, badge: 'Sale', emoji: '⚙️' },
  { id: 4, name: 'LiDAR Distance Sensor', category: 'Sensors', price: 44.99, originalPrice: null, badge: null, emoji: '📡' },
  { id: 5, name: 'FPV Drone Frame Kit 5"', category: 'Drones & FPV', price: 34.99, originalPrice: 45.00, badge: 'Sale', emoji: '🚁' },
  { id: 6, name: 'ESP32 Dev Board (USB-C)', category: 'Microcontrollers', price: 8.99, originalPrice: null, badge: 'Popular', emoji: '📶' },
  { id: 7, name: '3S LiPo Battery 2200mAh', category: 'Power & Batteries', price: 22.50, originalPrice: null, badge: null, emoji: '🔋' },
  { id: 8, name: 'Robotics Starter Kit', category: 'Kits & Bundles', price: 49.99, originalPrice: 65.00, badge: 'Best Value', emoji: '📦' },
];

const badgeColors: Record<string, string> = {
  'Best Seller': 'bg-[#00C2FF] text-[#0A0A0A]',
  'New': 'bg-[#059669] text-white',
  'Sale': 'bg-[#DC2626] text-white',
  'Popular': 'bg-[#7C3AED] text-white',
  'Best Value': 'bg-[#D97706] text-white',
};

export default function FeaturedProducts() {
  return (
    <section className="bg-[#0A0A0A] py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              🔥 Featured Products
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white">Top Picks This Week</h2>
          </div>
          <Link href="/shop" className="text-[#00C2FF] hover:text-white transition-colors text-sm font-semibold hidden md:block">
            View All Products →
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-[#161616] border border-[#2A2A2A] hover:border-[#00C2FF] rounded-2xl overflow-hidden group transition-all hover:bg-[#1A1A1A]"
            >
              {/* Product image area */}
              <div className="relative bg-[#222222] h-40 flex items-center justify-center">
                <span className="text-6xl">{product.emoji}</span>
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-1">{product.category}</p>
                <h3 className="text-white text-sm font-semibold leading-snug mb-3 group-hover:text-[#00C2FF] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-base">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-gray-600 text-xs line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="bg-[#00C2FF]/10 hover:bg-[#00C2FF] text-[#00C2FF] hover:text-[#0A0A0A] transition-all text-xs font-bold px-3 py-1.5 rounded-lg">
                    Add +
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop" className="border border-[#333] hover:border-[#00C2FF] text-gray-400 hover:text-white transition-all px-8 py-3 rounded-lg text-sm font-semibold inline-block">
            Browse All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
