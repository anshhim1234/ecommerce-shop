import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Button from './ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity: 1 });
  };
  
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden pb-[75%]">
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-medium text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-1">{product.name}</h3>
          <span className="font-bold text-lg text-blue-600">₹{product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mt-auto mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.reviews} reviews)</span>
          <span className="ml-auto text-xs text-gray-500 capitalize">{product.category}</span>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          fullWidth
          variant={product.inStock ? "primary" : "outline"}
          className="mt-auto"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
