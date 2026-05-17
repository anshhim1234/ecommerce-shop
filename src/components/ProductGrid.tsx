import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [sortBy, setSortBy] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  const sortedAndFilteredProducts = [...products]
    .filter(product => filterCategory ? product.category === filterCategory : true)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
          <p className="text-gray-600 mt-1">
            {sortedAndFilteredProducts.length} products available
          </p>
        </div>
        
        <div className="flex flex-wrap items-center space-x-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAndFilteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {sortedAndFilteredProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;