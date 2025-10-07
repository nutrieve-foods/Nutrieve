import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Zap, Leaf, Shield, Heart } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
};

type Props = {
  productId: string;
  onBack: () => void;
};

export default function ProductDetail({ productId, onBack }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('200gm');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/products`);
      const products = await response.json();
      const foundProduct = products.find((p: Product) => p.id === parseInt(productId));
      setProduct(foundProduct || null);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (basePrice: number, size: string): number => {
    const multipliers: Record<string, number> = {
      '200gm': 0.2,
      '500gm': 0.5,
      '1kg': 1.0
    };
    return basePrice * (multipliers[size] || 1.0);
  };

  const addToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      const token = localStorage.getItem('nutrieve_token');
      if (!token) {
        window.location.hash = '/login';
        return;
      }

      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
          size: selectedSize
        })
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    if (!addingToCart) {
      window.location.hash = '/cart';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            onClick={onBack}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <img
                src={product.image || '/background_image.jpg'}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              
              {/* Organic Badge */}
              <div className="absolute top-12 left-12 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Leaf className="w-4 h-4" />
                <span>100% Organic</span>
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-4">
                <span className="text-orange-600 text-sm font-medium">{product.category}</span>
              </div>
              
              <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.9) • 234 reviews</span>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['200gm', '500gm', '1kg'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{size}</div>
                      <div className="text-sm text-gray-600">
                        ₹{calculatePrice(product.price, size).toFixed(0)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-3xl font-bold text-gray-800">
                  ₹{(calculatePrice(product.price, selectedSize) * quantity).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">
                  ₹{calculatePrice(product.price, selectedSize).toFixed(0)} per {selectedSize}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-white border-2 border-orange-500 text-orange-600 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                
                <button
                  onClick={buyNow}
                  disabled={addingToCart}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Choose This Product?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">100% Pure & Natural</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-gray-700">Rich in Nutrients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Leaf className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Organically Sourced</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}