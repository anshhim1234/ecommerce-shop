import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import { products } from './data/products';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  const openLoginModal = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };
  
  const openSignupModal = () => {
    setAuthModalTab('signup');
    setIsAuthModalOpen(true);
  };
  
  const closeAuthModal = () => setIsAuthModalOpen(false);
  
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar 
            onCartClick={openCart} 
            onLoginClick={openLoginModal}
            onSignupClick={openSignupModal}
          />
          
          <main className="flex-grow">
            <Hero />
            
            <div className="py-12">
              <FeaturedProducts products={products} />
            </div>
            
            <div id="products" className="py-12 bg-white">
              <ProductGrid products={products} />
            </div>
          </main>
          
          <Footer />
          
          <Cart isOpen={isCartOpen} onClose={closeCart} />
          
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={closeAuthModal} 
            defaultTab={authModalTab}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;