import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  // Select top-rated products as featured
  const featuredProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <section id="featured" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">
              Our top-rated products handpicked for you
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View all
            <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <a
            href="#"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View all products
            <ChevronRight className="ml-1 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;