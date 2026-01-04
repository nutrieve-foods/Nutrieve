import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';


type HeaderProps = {
  user: any;
  setUser: (user: any) => void;
};

const Header = ({ user, setUser }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const productsRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu on route change
  useEffect(() => {
    const closeMenu = () => setIsMobileMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setShowProductsDropdown(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const navItems = [
    { name: 'Home', hash: '' },
    { name: 'Products', hash: 'products',dropdown: true },
    { name: 'About', hash: 'about' },
    { name: 'Benefits', hash: 'benefits' },
    { name: 'Contact', hash: 'contact' }
  ];

  const navigate = (hash: string) => {
    const sectionIds = ["about", "benefits", "contact"];
  
    // If navigating to homepage sections
    if (sectionIds.includes(hash)) {
      // Step 1: go to homepage
      window.location.hash = "";
  
      // Step 2: smooth scroll after page renders
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
  
      setIsMobileMenuOpen(false);
      return;
    }
  
    // Normal page navigation
    window.location.hash = hash;
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem('nutrieve_user');
    localStorage.removeItem('nutrieve_token');
    setUser(null);
    navigate("");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-white via-orange-50 to-white'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('')}
          >
            <img
              src="/logo.jpg"
              alt="Nutrieve Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
            />
            <span
              className={`font-playfair font-bold text-xl ${
                isScrolled ? 'text-gray-800' : 'text-[#8B4513]'
              }`}
            >
              Nutrieve
            </span>
          </motion.div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
  <div key={item.name} ref={item.dropdown ? productsRef : null} className="relative">


      <motion.button
        onClick={() => {
          if (item.dropdown) {
            setShowProductsDropdown((prev) => !prev);
          } else {
            navigate(item.hash);
          }
        }}
        
        className={`font-medium transition-colors hover:text-orange-600 ${
          isScrolled ? 'text-gray-700' : 'text-gray-800'
        }`}
        whileHover={{ y: -2 }}
      >
        <span className="flex items-center gap-1">
          {item.name}
          {item.dropdown && <span className="text-xs">▼</span>}
        </span>

      </motion.button>

      {/* PRODUCTS DROPDOWN */}
      {item.dropdown && showProductsDropdown && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-orange-100 z-50"
        >
          <button
            onClick={() => {
              window.location.hash = "products";
              setShowProductsDropdown(false);
              // setIsProductsOpen(false);
            }}
            
            className="block w-full text-left px-4 py-2 hover:bg-orange-50"
          >
            All Products
          </button>
          <button
            onClick={() => {
              window.location.hash = "products?category=fruit";
              setShowProductsDropdown(false);
              // setIsProductsOpen(false);
            }}
            
            className="block w-full text-left px-4 py-2 hover:bg-orange-50"
          >
            Fruits
          </button>
          <button
            onClick={() => { window.location.hash = "products?category=spices"; }}
            className="block w-full text-left px-4 py-2 hover:bg-orange-50"
          >
            Spices & Herbs
          </button>
          <button
            onClick={() => { window.location.hash = "products?category=veggies"; }}
            className="block w-full text-left px-4 py-2 hover:bg-orange-50"
          >
            Veggies
          </button>
        </div>
      )}
    </div>
  ))}
</nav>


          {/* CART + AUTH + MENU BUTTON */}
          <div className="flex items-center space-x-4">

            {/* CART */}
            <motion.button
              onClick={() => navigate('cart')}
              className={`p-2 rounded-full relative transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100'
                           : 'text-gray-800 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs
                 font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* AUTH BUTTONS */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => navigate('dashboard')}
                  className="px-4 py-2 rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 rounded-full border border-orange-400 text-orange-600 hover:bg-orange-50"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              className={`md:hidden p-2 rounded-full transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100'
                           : 'text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* MOBILE NAV */}
        {isMobileMenuOpen && (
          <motion.nav
            className="md:hidden py-4 border-t border-orange-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {navItems.map((item) => (
            item.name === "Products" ? (
              <div key={item.name}>
                <button
                  onClick={() => navigate('#products')}
                  className="block w-full text-left py-3 font-medium text-gray-700"
                >
                  All Products
                </button>

                <button
                 onClick={() => {
                  window.location.hash = "products?category=fruit";
                  setIsMobileMenuOpen(false);
                }}
                
                  className="block w-full text-left py-2 pl-4 text-gray-600"
                >
                  Fruits
                </button>

                <button
                  onClick={() => { window.location.hash = "products?category=spices";
                  setIsMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 pl-4 text-gray-600"
                >
                  Spices & Herbs
                </button>

                <button
                  onClick={() => { window.location.hash = "products?category=veggies";
                  setIsMobileMenuOpen(false); }}
                  className="block w-full text-left py-2 pl-4 text-gray-600"
                >
                  Veggies
                </button>
              </div>
            ) : (
              <button
                key={item.name}
                onClick={() => navigate(item.hash)}
                className="block w-full text-left py-3 text-base font-medium text-gray-700 hover:text-orange-600"
              >
                {item.name}
              </button>
            )
          ))}

              

            {user ? (
              <>
                <button
                  onClick={() => navigate('dashboard')}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-orange-600"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-orange-600"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-orange-600"
                >
                  Sign up
                </button>
              </>
            )}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
