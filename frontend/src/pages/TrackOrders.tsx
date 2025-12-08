import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

type Order = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_status: 'order_placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  estimated_delivery?: string;
  tracking_number?: string;
};

export default function TrackOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('nutrieve_token');
      if (!token) {
        window.location.hash = 'login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'order_placed', label: 'Order Placed', icon: CheckCircle },
      { key: 'processing', label: 'Processing', icon: Package },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.key === status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-2">
            Track Your Orders
          </h1>
          <p className="text-gray-600">
            Monitor the status of your recent orders
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to track your orders here.
            </p>
            <button
              onClick={() => window.location.hash = 'products'}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-gray-800">
                      Order #{order.id.toString().padStart(6, '0')}
                    </h3>
                    <p className="text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      ₹{order.total_amount.toFixed(0)}
                    </p>
                  </div>
                  <div className="text-right">
                    {order.tracking_number && (
                      <p className="text-sm text-gray-600 mb-2">
                        Tracking: {order.tracking_number}
                      </p>
                    )}
                    {order.estimated_delivery && (
                      <p className="text-sm text-green-600">
                        Est. Delivery: {order.estimated_delivery}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    {getTrackingSteps(order.tracking_status || 'order_placed').map((step, stepIndex) => (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : step.active 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <p className={`text-xs text-center ${
                          step.completed || step.active ? 'text-gray-800 font-medium' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {stepIndex < getTrackingSteps(order.tracking_status || 'order_placed').length - 1 && (
                          <div className="hidden" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800">Need Help?</p>
                      <p className="text-sm text-gray-600">Contact our support team</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      window.location.hash = '';
                      setTimeout(() => {
                        window.location.hash = 'contact';
                      }, 50);
                    }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Contact Us
                  </button>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}