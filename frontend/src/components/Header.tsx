import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', hash: '' },
    { name: 'Products', hash: 'products' },
    { name: 'About', hash: 'about' },
    { name: 'Benefits', hash: 'benefits' },
    { name: 'Contact', hash: 'contact' }
  ];

  const handleNavClick = (hash: string) => {
    console.log('Nav clicked:', hash); // Debug log
    if (hash === '') {
      window.location.hash = '';
    } else {
      window.location.hash = hash;
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nutrieve_user');
    localStorage.removeItem('nutrieve_token');
    setUser(null);
    window.location.hash = '';
  };

  const handleCartClick = () => {
    console.log('Cart clicked'); // Debug log
    window.location.hash = 'cart';
  };

  const handleLoginClick = () => {
    console.log('Login clicked'); // Debug log
    window.location.hash = 'login';
  };

  const handleSignupClick = () => {
    console.log('Signup clicked'); // Debug log
    window.location.hash = 'signup';
  };

  const handleDashboardClick = () => {
    console.log('Dashboard clicked'); // Debug log
    window.location.hash = 'dashboard';
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
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleNavClick('')}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => handleNavClick(item.hash)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isScrolled ? 'text-gray-700' : 'text-gray-800'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Cart, Auth & Mobile Menu */}
          <div className="flex items-center space-x-4 relative">
            {/* Cart Icon with Count */}
            <motion.button
              onClick={handleCartClick}
              className={`p-2 rounded-full relative transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-800 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <button
                  onClick={handleDashboardClick}
                  className={`px-4 py-2 rounded-full border ${
                    isScrolled
                      ? 'border-orange-400 text-orange-600 hover:bg-orange-50'
                      : 'border-orange-400 text-orange-600 hover:bg-orange-50'
                  }`}
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
                  onClick={handleLoginClick}
                  className={`px-4 py-2 rounded-full border ${
                    isScrolled
                      ? 'border-orange-400 text-orange-600 hover:bg-orange-50'
                      : 'border-orange-400 text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className={`md:hidden p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            className="md:hidden py-4 border-t border-orange-200 bg-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.hash)}
                className="block w-full text-left py-3 text-base font-medium text-gray-700 hover:text-orange-600"
              >
                {item.name}
              </button>
            ))}
            
            {user ? (
              <>
                <button
                  onClick={handleDashboardClick}
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
                  onClick={handleLoginClick}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-orange-600"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
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