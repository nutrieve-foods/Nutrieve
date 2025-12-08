import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Eye } from 'lucide-react';

type Product = { 
  id: number; 
  name: string; 
  price: number; 
  image?: string | null; 
  description?: string 
};

type Props = {
  onProductSelect?: (productId: string) => void;
};

export default function Products({ onProductSelect }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(apiUrl + '/api/products');

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number) => {
    const token = localStorage.getItem('nutrieve_token');
    if (!token) {
      window.location.hash = 'login';
      return;
    }

    setAddingToCart(productId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
          size: '200gm'
        })
      });

      if (!response.ok) throw new Error("Failed adding to cart");

      setCart(c => ({ ...c, [productId]: (c[productId] || 0) + 1 }));
      
    } catch (error) {
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  function inc(id: number) {
    addToCart(id);
  }

  function dec(id: number) {
    setCart(c => {
      const n = Math.max((c[id] || 0) - 1, 0);
      const next = { ...c };
      if (n === 0) delete next[id]; else next[id] = n;
      return next;
    });
  }

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        default: return a.name.localeCompare(b.name);
      }
    });

  const total = items.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button
            onClick={loadProducts}
            className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Premium Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Authentic organic spice powders made with purity & tradition.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border rounded-xl"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>

          </div>
        </motion.div>

        {/* PRODUCT GRID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-4 sm:gap-6 lg:gap-8 
            mb-8
          "
        >

          {filteredItems.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-200 transition-all"
              whileHover={{ y: -4 }}
            >
              
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={p.image || '/background_image.jpg'}
                  alt={p.name}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition"
                />

                <button
                  onClick={() => onProductSelect?.(p.id.toString())}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">
                <h3 className="font-playfair text-lg font-semibold text-gray-800">
                  {p.name}
                </h3>

                <p className="text-gray-600 text-xs line-clamp-2">
                  {p.description || 'Premium organic spice powder'}
                </p>

                {/* FIXED ALIGNMENT PRICE + QUANTITY */}
                <div className="flex items-center justify-between mt-3">
                  
                  {/* PRICE */}
                  <div>
                    <div className="text-lg font-bold text-gray-800">₹{p.price}</div>
                    <div className="text-[11px] text-gray-500">1000g pack</div>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 h-9">

                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition"
                      onClick={() => dec(p.id)}
                    >
                      -
                    </button>

                    <div className="w-6 text-center font-semibold">
                      {cart[p.id] || 0}
                    </div>

                    <button
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex justify-center items-center hover:bg-orange-600 transition"
                      onClick={() => inc(p.id)}
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={() => onProductSelect?.(p.id.toString())}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 rounded-xl font-semibold hover:opacity-90"
                >
                  View Details
                </button>

              </div>
            </motion.div>
          ))}

        </motion.div>

        {/* CART SUMMARY FLOATING BAR */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 z-50"
          >
            <div className="flex justify-between min-w-80">
              <div>
                <div className="font-semibold">{totalItems} items in cart</div>
                <div className="text-sm text-gray-600">Total: ₹{total}</div>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-xl font-semibold">
                Checkout
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
