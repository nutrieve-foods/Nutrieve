import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

type Product = { id: number; name: string; price: number; image?: string | null; description?: string };

type Props = {
  onProductSelect?: (productId: string) => void;
};

export default function Products({ onProductSelect }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const { cart, setCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ added navigation hook

  useEffect(() => {
    (async () => {
      setLoading(true);
      const base = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000';
      const r = await fetch(base + '/api/products');
      setItems(await r.json());
      setLoading(false);
    })();
  }, []);

  function inc(id: number) {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function dec(id: number) {
    setCart(c => {
      const n = Math.max((c[id] || 0) - 1, 0);
      const next = { ...c } as any;
      if (n === 0) delete next[id]; else next[id] = n;
      return next;
    });
  }

  const filteredItems = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const total = items.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Premium Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover authentic Indian flavors with our carefully curated selection of organic spice powders
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8"
        >
          {filteredItems.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image || '/background_image.jpg'}
                  alt={p.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Quick View Button */}
                <button
                  onClick={() => onProductSelect?.(p.id.toString())}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Organic
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-playfair text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {p.name}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {p.description || 'Premium quality organic powder for authentic flavors'}
                </p>

                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">₹{p.price}</div>
                    <div className="text-sm text-gray-500">200g pack</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      onClick={() => dec(p.id)}
                    >
                      -
                    </button>
                    <div className="min-w-8 text-center font-semibold">{cart[p.id] || 0}</div>
                    <button
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                      onClick={() => inc(p.id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                    onClick={() => onProductSelect?.(p.id.toString())}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Cart Summary - Fixed Bottom */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 z-50 border border-gray-200"
          >
            <div className="flex items-center justify-between min-w-80">
              <div className="text-gray-700">
                <div className="font-semibold">{totalItems} items in cart</div>
                <div className="text-sm text-gray-600">Total: ₹{total}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/cart')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  View Cart
                </button>
                <button
                  onClick={() => navigate('/address')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
