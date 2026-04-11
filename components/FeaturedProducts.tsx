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
  'Best Seller': 'bg-[#F5C100] text-[#111111]',
  'New': 'bg-[#111111] text-white',
  'Sale': 'bg-[#DC2626] text-white',
  'Popular': 'bg-[#7C3AED] text-white',
  'Best Value': 'bg-[#059669] text-white',
};

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F5C100]/20 border border-[#F5C100] text-[#111111] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
              🔥 Featured Products
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#111111]">Top Picks This Week</h2>
          </div>
          <Link href="/shop" className="text-[#111111] hover:text-[#F5C100] transition-colors text-sm font-bold hidden md:block border-b-2 border-[#F5C100]">
            View All Products →
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white border-2 border-gray-100 hover:border-[#F5C100] rounded-2xl overflow-hidden group transition-all hover:shadow-lg"
            >
              {/* Product image area */}
              <div className="relative bg-[#FEF9E7] h-40 flex items-center justify-center">
                <span className="text-6xl">{product.emoji}</span>
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="p-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs mb-1">{product.category}</p>
                <h3 className="text-[#111111] text-sm font-semibold leading-snug mb-3 group-hover:text-[#333333] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#111111] font-bold text-base">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button className="bg-[#F5C100] hover:bg-[#e0b000] text-[#111111] transition-all text-xs font-bold px-3 py-1.5 rounded-lg">
                    Add +
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop" className="bg-[#111111] hover:bg-[#333333] transition-colors text-white px-8 py-3 rounded-lg text-sm font-bold inline-block">
            Browse All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
