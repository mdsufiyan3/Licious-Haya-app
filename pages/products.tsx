import React, { useState } from 'react';
import Link from 'next/link';
import { LICIOUS_PRODUCTS } from '../products';
import { SparkleIcon } from '../constants';

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = LICIOUS_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-[#E21D24] flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200">
                L
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Licious</h1>
                <p className="text-xs text-gray-500">Fresh Products</p>
              </div>
            </Link>
            <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-700 font-bold uppercase tracking-wider">In Stock</span>
            </div>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E21D24] focus:ring-2 focus:ring-red-100 outline-none transition-all text-[14px]"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black mb-3">
            Our Fresh <span className="text-[#E21D24]">Licious</span> Selection
          </h2>
          <p className="text-gray-600 text-lg">Handpicked premium quality meat, fish, and fresh products</p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#E21D24] hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x300?text=Licious+Fresh';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-[#1A1A1A] px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                    {product.weight}
                  </div>
                  <div className="absolute top-4 left-4 bg-[#E21D24]/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md">
                    Fresh
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-4">
                  {/* Name */}
                  <h3 className="text-xl font-bold text-[#1A1A1A] group-hover:text-[#E21D24] transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 h-16">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#E21D24]">{product.price}</span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">per {product.weight}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-4" />

                  {/* Product Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Weight</p>
                      <p className="font-bold text-[#1A1A1A]">{product.weight}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Price</p>
                      <p className="font-bold text-[#E21D24]">{product.price}</p>
                    </div>
                  </div>

                  {/* Product ID */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Product ID</p>
                    <p className="font-mono text-xs text-gray-700">{product.id}</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#E21D24] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#C1181E] transition-colors text-center text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
                    >
                      Buy Now
                    </a>
                    <button
                      onClick={() => {
                        navigator?.clipboard?.writeText(product.productUrl);
                      }}
                      className="bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                      title="Copy product URL"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-500 text-lg font-medium">No products found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[#E21D24] font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-center text-gray-600 text-sm">
          <p>
            All products are sourced from{' '}
            <a
              href="https://www.licious.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E21D24] font-bold hover:underline"
            >
              Licious
            </a>
            . Fresh quality guaranteed!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductsPage;
