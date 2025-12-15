import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import FeaturedProducts from './components/FeaturedProducts';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import AddressForm from './pages/AddressForm';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrders from './pages/TrackOrders';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ReturnsPolicy from './pages/ReturnsPolicy';
import ShippingInfo from './pages/ShippingInfo';
import Disclaimer from './pages/Disclaimer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('nutrieve_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('nutrieve_user');
        localStorage.removeItem('nutrieve_token');
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      window.scrollTo(0, 0);
      console.log('Hash changed to:', hash); // Debug log
      
      if (hash.startsWith('product/')) {
        const productId = hash.split('/')[1];
        setSelectedProductId(productId);
        setCurrentPage('product-detail');
      } else if (hash.startsWith('order-success/')) {
        const orderIdFromHash = parseInt(hash.split('/')[1]);
        setOrderId(orderIdFromHash);
        setCurrentPage('order-success');
      } else {
        setCurrentPage(hash || 'home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    window.location.hash = `product/${productId}`;
  };

  const handleBackToProducts = () => {
    window.location.hash = 'products';
  };

  const handleAuthSuccess = () => {
    const userData = localStorage.getItem('nutrieve_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data after auth:', error);
      }
    }
    window.location.hash = 'dashboard';
  };

  const handleAddressNext = (address: any) => {
    setSelectedAddress(address);
    setCurrentPage('payment');
  };

  const handlePaymentSuccess = (orderId: number) => {
    setOrderId(orderId);
    window.location.hash = `order-success/${orderId}`;
  };

  const renderPage = () => {
    console.log('Rendering page:', currentPage); // Debug log
    
    switch (currentPage) {
      case 'login':
        return <Login onSignedIn={handleAuthSuccess} />;
      case 'signup':
        return <Signup onSignedUp={handleAuthSuccess} />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'reset-password':
        return <ResetPassword />;
      case 'products':
        return <Products onProductSelect={handleProductSelect} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetail productId={selectedProductId} onBack={handleBackToProducts} />
        ) : (
          <Products onProductSelect={handleProductSelect} />
        );
      case "privacy-policy":
        return <PrivacyPolicy />;

      case "terms":
        return <TermsOfService />;

      case "returns":
        return <ReturnsPolicy />;

      case "shipping":
        return <ShippingInfo />;

      case "disclaimer":
        return <Disclaimer />;

      case 'cart':
        return <Cart />;
      case 'checkout':
        return <AddressForm 
          onBack={() => window.location.hash = 'cart'}
          onNext={handleAddressNext}
        />;
      case 'dashboard':
        return user ? <Dashboard /> : <Login onSignedIn={handleAuthSuccess} />;
      case 'leads':
        return <Leads />;
      case 'address':
        return (
          <AddressForm
            onBack={() => window.location.hash = 'cart'}
            onNext={handleAddressNext}
          />
        );
      case 'payment':
        return (
          <Payment
            orderData={{
              address: selectedAddress || {},
              items: [],
              total: 0,
            }}
            onBack={() => setCurrentPage('address')}
            onSuccess={handlePaymentSuccess}
          />
        );
      case 'order-success':
        return orderId ? <OrderSuccess orderId={orderId} /> : <Dashboard />;
      case 'track-orders':
        return <TrackOrders />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <FeaturedProducts />
            <About />
            <Benefits />
            <Testimonials />
            <Contact />
          </>
        );
    }
  };

  return (
    <CartProvider>
     <div className="min-h-screen overflow-x-hidden">
        <Header user={user} setUser={setUser} />
        <main>{renderPage()}</main>
        { <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;