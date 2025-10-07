import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, LogOut, ShoppingBag, Clock,  CheckCircle } from 'lucide-react';

type Order = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: Array<{
    id: number;
    quantity: number;
    size: string;
    price: number;
    product: {
      name: string;
      image?: string;
    };
  }>;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('nutrieve_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('nutrieve_token');
      if (!token) {
        window.location.hash = '/login';
        return;
      }

      const response = await fetch(`${(import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
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

  const handleLogout = () => {
    localStorage.removeItem('nutrieve_user');
    localStorage.removeItem('nutrieve_token');
    window.location.hash = '/';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <button
            onClick={() => window.location.hash = '/login'}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-playfair text-3xl font-bold text-gray-800">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8"
        >
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">Order History</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                <button
                  onClick={() => window.location.hash = '/products'}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Order #{order.id.toString().padStart(6, '0')}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          ₹{order.total_amount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                          <img
                            src={item.product.image || '/background_image.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.product.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.size} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">₹{item.price.toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="font-playfair text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="p-3 bg-gray-50 rounded-xl text-gray-800">{user.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="p-3 bg-gray-50 rounded-xl text-gray-800">{user.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="p-3 bg-gray-50 rounded-xl text-gray-800">{user.phone || 'Not provided'}</div>
              </div>
              
              <div className="pt-4">
                <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all">
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <button
            onClick={() => window.location.hash = '/products'}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group"
          >
            <ShoppingBag className="w-12 h-12 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-2">Continue Shopping</h3>
            <p className="text-gray-600 text-sm">Explore our premium products</p>
          </button>
          
          <button
            onClick={() => window.location.hash = '/cart'}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group"
          >
            <Package className="w-12 h-12 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-2">View Cart</h3>
            <p className="text-gray-600 text-sm">Check your cart items</p>
          </button>
          
          <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-center group">
            <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-gray-800 mb-2">Manage Addresses</h3>
            <p className="text-gray-600 text-sm">Update delivery addresses</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}