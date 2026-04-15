import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/data/products';

const BADGE_COLORS: Record<string, string> = {
  'Best Seller': 'bg-[#F5C100] text-[#111111]',
  'New':         'bg-[#111111] text-white',
  'Sale':        'bg-[#DC2626] text-white',
  'Popular':     'bg-[#7C3AED] text-white',
  'Limited':     'bg-[#EA580C] text-white',
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;

  return (
    <div className="min-h-screen bg-[#F9F9F9]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#F5C100] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#F5C100] transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-[#F5C100] transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main product section */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">

          {/* Left: Image */}
          <div className="lg:w-[45%]">
            <div className="bg-white border-2 border-gray-100 rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
              <span className="text-[120px]">{product.emoji}</span>
              {product.badge && (
                <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1 rounded-full ${BADGE_COLORS[product.badge]}`}>
                  {product.badge}
                </span>
              )}
              {savings > 0 && (
                <span className="absolute top-4 right-4 bg-[#DC2626] text-white text-sm font-bold px-2 py-1 rounded-lg">
                  Save ${savings.toFixed(2)}
                </span>
              )}
            </div>
            {/* Thumbnail strip placeholder */}
            <div className="flex gap-2 mt-3">
              {[1,2,3].map((i) => (
                <div key={i} className="w-16 h-16 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#F5C100] transition-colors">
                  <span className="text-2xl opacity-40">{product.emoji}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:w-[55%] flex flex-col gap-5">
            <div>
              <p className="text-gray-400 text-sm mb-1">{product.brand} · {product.category}</p>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#111111] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`h-5 w-5 ${star <= Math.round(product.rating) ? 'text-[#F5C100]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} · {product.reviews} reviews</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Price */}
            <div className="bg-[#FEF9E7] border-2 border-[#F5C100]/30 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-3xl font-extrabold text-[#111111]">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-400 mt-0.5">
                    <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="ml-2 text-[#DC2626] font-semibold">You save ${savings.toFixed(2)}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>
                {product.inStock && product.stockCount <= 10 && (
                  <p className="text-xs text-[#EA580C] mt-0.5">Only {product.stockCount} left!</p>
                )}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button className="px-4 py-3 text-[#111111] hover:bg-gray-50 font-bold text-lg transition-colors">−</button>
                <span className="px-4 py-3 font-semibold text-[#111111] border-x-2 border-gray-200">1</span>
                <button className="px-4 py-3 text-[#111111] hover:bg-gray-50 font-bold text-lg transition-colors">+</button>
              </div>
              <button
                className={`flex-1 font-bold py-3 rounded-xl text-base transition-all ${product.inStock ? 'bg-[#F5C100] hover:bg-[#e0b000] text-[#111111]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="border-2 border-gray-200 hover:border-[#F5C100] p-3 rounded-xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🚚', title: 'Free Shipping', sub: 'Orders over $99' },
                { icon: '↩️', title: 'Easy Returns', sub: '30-day policy' },
                { icon: '🔒', title: 'Secure Payment', sub: 'SSL encrypted' },
              ].map((badge) => (
                <div key={badge.title} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                  <p className="text-xl mb-1">{badge.icon}</p>
                  <p className="text-xs font-semibold text-[#111111]">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.sub}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden mb-12">
          <div className="flex border-b border-gray-100">
            {['Description', 'Specifications', 'Reviews'].map((tab, i) => (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-semibold transition-colors ${i === 0 ? 'text-[#111111] border-b-2 border-[#F5C100]' : 'text-gray-500 hover:text-[#111111]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Description + Features */}
              <div>
                <h3 className="font-bold text-[#111111] text-lg mb-3">About this product</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{product.description}</p>
                <h4 className="font-bold text-[#111111] mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#F5C100] font-bold text-base mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs table */}
              <div>
                <h3 className="font-bold text-[#111111] text-lg mb-3">Specifications</h3>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  {Object.entries(product.specs).map(([key, value], i) => (
                    <div key={key} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="w-44 flex-shrink-0 px-4 py-2.5 text-gray-500 font-medium">{key}</span>
                      <span className="flex-1 px-4 py-2.5 text-[#111111] font-semibold border-l border-gray-100">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-[#111111] mb-6">You might also need</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="bg-white border-2 border-gray-100 hover:border-[#F5C100] rounded-2xl overflow-hidden group transition-all hover:shadow-lg"
                >
                  <div className="bg-[#FEF9E7] h-32 flex items-center justify-center">
                    <span className="text-4xl">{p.emoji}</span>
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <p className="text-[#111111] text-sm font-semibold line-clamp-2 mb-1">{p.name}</p>
                    <p className="text-[#111111] font-bold">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
