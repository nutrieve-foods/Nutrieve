import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

type Props = {
  orderData: {
    address: any;
    items: any[];
    total: number;
  };
  onBack: () => void;
  onSuccess: (orderId: number) => void;
};

export default function Payment({ orderData, onBack, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('phonepe');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  // ----- Helpers copied from cart page for accurate totals -----
  const calculatePrice = (basePrice: number, size: string): number => {
    const multipliers: Record<string, number> = {
      '200gm': 1.0,
      '500gm': 2.3,
      '1kg': 4.2
    };
    return basePrice * (multipliers[size] || 1.0);
  };

  const calculateItemTotal = (item: any): number => {
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
  const displayTotal = cartItems.length > 0 ? calculateTotal() : (orderData.total || 0);

  // ----- Load cart items so we can show price details -----
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('nutrieve_token');
        if (!token) {
          setError('Please login to proceed with payment');
          setCartLoading(false);
          return;
        }

        const response = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load cart');
        }

        const data = await response.json();
        setCartItems(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load cart');
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
  
    try {
      if (!orderData.address?.id) {
        throw new Error('Please select an address before payment');
      }

      if (cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      const token = localStorage.getItem("nutrieve_token");
  
      // 1️⃣ Create order with full details for testing
      const totalAmount = calculateTotal();
      const orderResponse = await fetch(
        `${(import.meta as any).env.VITE_API_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address_id: orderData.address.id,
            items: cartItems.map((item: any) => ({
              product_id: item.product_id,
              size: item.size,
              quantity: item.quantity,
              price: calculatePrice(item.product.base_price, item.size),
            })),
            total_amount: totalAmount,
            payment_status: "completed", // ✅ Mark payment completed
          }),
        }
      );
  
      if (!orderResponse.ok) {
        const errorData = await orderResponse.text();
        throw new Error(errorData || "Failed to create order");
      }
  
      const order = await orderResponse.json();
  
      // 2️⃣ Simulate payment success
      setTimeout(() => {
        onSuccess(order.id);
      }, 1000);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-2 text-orange-600">
                <CreditCard className="w-6 h-6" />
                <h1 className="font-playfair text-2xl font-bold">Payment</h1>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <div className="w-16 h-1 bg-green-500"></div>
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <div className="w-16 h-1 bg-green-500"></div>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg text-gray-800 mb-4">Choose Payment Method</h3>
              
              {/* PhonePe */}
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'phonepe' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('phonepe')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Pe</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">PhonePe</h4>
                    <p className="text-sm text-gray-600">Pay securely with PhonePe UPI</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'phonepe' 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'phonepe' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI */}
              <div
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">UPI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">UPI Payment</h4>
                    <p className="text-sm text-gray-600">Pay with any UPI app</p>
                  </div>
                  <div className="ml-auto">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'upi' 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'upi' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Your payment information is secure and encrypted
                </span>
              </div>
            </div>

            {/* Pay Button */}
            <motion.button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Pay ₹{displayTotal.toFixed(0)}</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="font-playfair text-xl font-bold text-gray-800 mb-6">Order Summary</h3>
            
          {/* Order Details */}
          <div className="space-y-4 mb-6">
            {cartLoading ? (
              <div className="text-gray-600 text-sm">Loading price details...</div>
            ) : cartItems.length === 0 ? (
              <div className="text-gray-600 text-sm">No items in cart.</div>
            ) : (
              (() => {
                const subtotal = calculateSubtotal();
                const cgst = calculateCGST(subtotal);
                const sgst = calculateSGST(subtotal);
                const total = calculateTotal();

                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">CGST (2.5%)</span>
                      <span className="font-semibold">₹{cgst.toFixed(0)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">SGST (2.5%)</span>
                      <span className="font-semibold">₹{sgst.toFixed(0)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span>₹{total.toFixed(0)}</span>
                    </div>
                  </>
                );
              })()
            )}
          </div>


            {/* Delivery Address */}
            <div className="border-t pt-6 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Delivery Address</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{orderData.address.full_name}</p>
                <p>{orderData.address.flat_no}, {orderData.address.street}</p>
                {orderData.address.landmark && <p>{orderData.address.landmark}</p>}
                <p>{orderData.address.city}, {orderData.address.state} - {orderData.address.pincode}</p>
                <p>{orderData.address.phone}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}