import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import Button from './ui/Button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  if (!isOpen) return null;
  
  const cartProducts = cart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...product,
      quantity: item.quantity
    };
  }).filter(Boolean);
  
  const total = cartProducts.reduce((sum, item) => {
    return sum + (item?.price || 0) * (item?.quantity || 0);
  }, 0);
  
  const handleIncreaseQuantity = (productId: string) => {
    const item = cartProducts.find(p => p?.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (productId: string) => {
    const item = cartProducts.find(p => p?.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    } else if (item) {
      removeFromCart(productId);
    }
  };
  
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
      
      // Create a payment intent on the server
      const response = await fetch('http://localhost:8000/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          total: total,
        }),
      });
      
      const { clientSecret } = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await stripe.confirmPayment({
        elements: {
          clientSecret,
        },
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });
      
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Your Cart
                  <span className="ml-2 text-sm text-gray-500">
                    ({cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'})
                  </span>
                </h2>
                <button
                  onClick={onClose}
                  className="ml-3 h-7 flex items-center justify-center"
                >
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-500" />
                </button>
              </div>

              <div className="mt-8">
                {cartProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start shopping to add items to your cart
                    </p>
                    <div className="mt-6">
                      <Button onClick={onClose}>
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartProducts.map((product) => (
                        product && (
                          <li key={product.id} className="py-6 flex">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3 className="line-clamp-1">
                                    {product.name}
                                  </h3>
                                  <p className="ml-4">${(product.price * product.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{product.category}</p>
                              </div>
                              
                              <div className="flex-1 flex items-end justify-between">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    onClick={() => handleDecreaseQuantity(product.id)}
                                    className="p-1"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-2 text-gray-900">{product.quantity}</span>
                                  <button
                                    onClick={() => handleIncreaseQuantity(product.id)}
                                    className="p-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="flex">
                                  <button
                                    onClick={() => removeFromCart(product.id)}
                                    className="font-medium text-blue-600 hover:text-blue-500 flex items-center"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      ))}
                    </ul>
                    
                    {cartProducts.length > 0 && (
                      <div className="mt-4">
                        <button
                          onClick={clearCart}
                          className="text-sm text-red-600 hover:text-red-500 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Clear cart
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {cartProducts.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                
                <div className="mt-6">
                  <Button 
                    fullWidth 
                    className="bg-blue-600 text-white"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </Button>
                </div>
                
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:text-blue-500"
                      onClick={onClose}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;