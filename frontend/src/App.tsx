// import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductsPage from './pages/Products';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

function App() {
  const route = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
  const go = (hash: string) => { window.location.hash = hash; };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      {route === '/login' ? (
        <LoginPage onSignedIn={() => go('/products')} />
      ) : route === '/signup' ? (
        <SignupPage onSignedUp={() => go('/products')} />
      ) : route === '/products' ? (
        <ProductsPage />
      ) : (
        <>
          <Hero />
          <FeaturedProducts />
          <About />
          <Benefits />
          <Testimonials />
          <Contact />
        </>
      )}
      <Footer />
    </div>
  );
}
// export default function App() { return <Leads />; }

export default App;  
