import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  size: string;
  product: {
    id: number;
    name: string;
    base_price: number;
    image?: string;
    description?: string;
  };
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('nutrieve_token');
      if (!token) {
        setError('Please login to view cart');
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load cart');
      }

      const data = await response.json();
      setCartItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      const token = localStorage.getItem('nutrieve_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      // Update local state
      setCartItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      const token = localStorage.getItem('nutrieve_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Update local state
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const calculatePrice = (basePrice: number, size: string): number => {
    const multipliers: Record<string, number> = {
      '200gm': 1.0,
      '500gm': 2.3,
      '1kg': 4.2
    };
    return basePrice * (multipliers[size] || 1.0);
  };

  const calculateItemTotal = (item: CartItem): number => {
    const price = calculatePrice(item.product.base_price, item.size);
    return price * item.quantity;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateCGST = (subtotal: number): number => subtotal * 0.025;
  const calculateSGST = (subtotal: number): number => subtotal * 0.025;

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateCGST(subtotal) + calculateSGST(subtotal);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.hash = 'products'}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => window.location.hash = 'products'}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-3 gap-3 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
                  >
                    {/* IMAGE LEFT */}
                    <div className="col-span-1 flex justify-center">
                      <img
                        src={item.product.image || '/background_image.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* NAME + SIZE + PRICE */}
                    <div className="col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-md leading-tight">
                          {item.product.name}
                        </h3>

                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {item.product.description || 'Premium organic powder'}
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-medium text-orange-600">
                            Size: {item.size}
                          </span>

                          <span className="text-lg font-bold text-gray-800">
                            ₹{calculatePrice(item.product.base_price, item.size).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* QUANTITY + REMOVE + TOTAL */}
                      <div className="flex justify-between items-center mt-3">
                        
                        {/* Qty Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-6 text-center font-semibold">{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* TOTAL + DELETE */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            ₹{calculateItemTotal(item).toFixed(0)}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={updating === item.id}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 inline-block" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="font-playfair text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{calculateSubtotal().toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST (2.5%)</span>
                  <span className="font-semibold">₹{calculateCGST(calculateSubtotal()).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST (2.5%)</span>
                  <span className="font-semibold">₹{calculateSGST(calculateSubtotal()).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => window.location.hash = 'address'}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mt-6"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => window.location.hash = 'products'}
                className="w-full border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 mt-4"
              >
                Continue Shopping
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

}