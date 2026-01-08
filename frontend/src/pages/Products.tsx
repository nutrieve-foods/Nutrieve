import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ListFilter as Filter, Eye } from 'lucide-react';



type Product = { 
  id: number; 
  name: string; 
  base_price: number; 
  category: string;          // 👈 ADD THIS
  image?: string | null; 
  description?: string 
};

type Props = {
  onProductSelect?: (productId: string) => void;
};

export default function Products({ onProductSelect }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [cart, setCart] = useState<
  Record<number, { quantity: number; cartItemId: number }>
>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  // Live-update category on hash change
  useEffect(() => {
    const updateCategoryFromHash = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split("?")[1]);
      const cat = params.get("category");
      setCategory(cat);
    };
    updateCategoryFromHash();
    window.addEventListener("hashchange", updateCategoryFromHash);
    return () => window.removeEventListener("hashchange", updateCategoryFromHash);
  }, []);
    
  useEffect(() => {
    const handler = () => loadCart();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(apiUrl + '/api/products');

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      
      const data = await response.json();
      console.log("PRODUCTS FROM API:", data); 
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    const token = localStorage.getItem("nutrieve_token");
  
    // If user not logged in → always set empty cart ONCE and return
    if (!token) {
      setCart({});
      return;
    }
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    try {
      const res = await fetch(apiUrl + "/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) {
        setCart({});
        return;
      }
  
      const data = await res.json();
  
      const cartMap: Record<number, { quantity: number; cartItemId: number }> = {};
      data.forEach((item: any) => {
        cartMap[item.product_id] = { quantity: item.quantity, cartItemId: item.id };
      });
  
      setCart(cartMap);
    } catch (e) {
      console.error("Cart load failed", e);
      setCart({});
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
          size: '1kg'
        })
      });

      if (!response.ok) throw new Error("Failed adding to cart");

      setCart(prev => {
        const existing = prev[productId];
        return {
          ...prev,
          [productId]: {
            quantity: existing ? existing.quantity + 1 : 1,
            cartItemId: existing?.cartItemId || 0   // backend returns new ID on next loadCart
          }
        };
      });
      
      
    } catch (error) {
      alert("Failed to add product to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  function inc(id: number) {
    addToCart(id);
  }

  const dec = async (productId: number) => {
    const token = localStorage.getItem("nutrieve_token");
    if (!token) return;
  
    const entry = cart[productId];
    if (!entry) return;
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    // Case: delete item
    if (entry.quantity <= 1) {
      await fetch(`${apiUrl}/api/cart/${entry.cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setCart(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
  
      return;
    }
  
    // Case: reduce quantity
    await fetch(`${apiUrl}/api/cart/${entry.cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: entry.quantity - 1 })
    });
  
    setCart(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: prev[productId].quantity - 1
      }
    }));
  };
  

  const filteredItems = items
  .filter(item => {
    if (!category) return true;
    const itemCategory = item.category?.toLowerCase();
    if (category === "fruit") return item.category === "Fruit";
    if (category === "spices") return item.category === "Spices & Herbs";
    if (category === "veggies") return item.category === "Veggies";
    return true;
  })
  .filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.base_price - b.base_price;
      case 'price-high': return b.base_price - a.base_price;
      default: return a.name.localeCompare(b.name);
    }
  })
  

    const total = items.reduce(
      (sum, p) => sum + (cart[p.id]?.quantity || 0) * p.base_price,
      0
    );
    
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 pt-[114px] pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Premium Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Authentic spice powders made with purity & tradition.
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
                      gap-2 sm:gap-5 lg:gap-5
                    "

        >

          {filteredItems.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl overflow-visible border border-gray-200 transition-all flex flex-col h-[500px] sm:h-[450px]"
              whileHover={{ y: -4 }}
            >
              
              {/* Image */}
              {/* <div className="relative h-[220px] sm:h-[180px] bg-white rounded-t-xl overflow-hidden flex items-center justify-center"> */}
              <div className="relative h-[220px] sm:h-[180px] rounded-t-xl overflow-hidden">


                <img
                  src={`/${p.image}`} 
                  alt={p.name}
                  // className="w-full h-[px] sm:h-[180px] object-contain sm:object-cover bg-white rounded-t-xl"
                   className="w-full h-full object-cover"
                />

                <button
                  onClick={() => onProductSelect?.(p.id.toString())}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col gap-3 flex-grow">
              <h3 className="font-playfair text-lg font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[48px]">


                  {p.name}
                </h3>

                <p className="text-gray-600 text-xs line-clamp-2 min-h-[32px]">

                  {p.description || 'Premium organic spice powder'}
                </p>

                {/* PRICE AND QUANTITY SECTION */}
                <div className="mt-auto sm:flex sm:items-end sm:gap-4">

                  {/* PRICE SECTION */}
                  <div className="mb-3 sm:mb-0 sm:flex-shrink-0">

                    {/* OFFER TAG */}
                    <div className="inline-block mb-1 px-2 py-[2px] bg-red-100 text-red-600 text-[10px] font-semibold rounded">
                      Launching Offer
                    </div>

                    {/* DISCOUNT */}
                    <div className="text-xs text-red-600 font-semibold">
                      -30%
                    </div>

                    {/* PRICE */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{Math.round(p.base_price * 0.7)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{p.base_price}
                      </span>
                    </div>

                    {/* PRICE PER 100g */}
                    <div className="text-[11px] text-gray-500">
                      ₹{Math.round((p.base_price * 0.7) / 10)} per 100g
                    </div>

                    <div className="text-[11px] text-gray-500">1000g pack</div>
                  </div>

                  {/* MOBILE QUANTITY CONTROLS - Centered, full width */}
                  <div className="flex sm:hidden items-center justify-center gap-3 w-full py-2">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition"
                      onClick={() => dec(p.id)}
                    >
                      -
                    </button>
                    <div className="w-8 text-center font-semibold">
                      {cart[p.id]?.quantity || 0}
                    </div>
                    <button
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex justify-center items-center hover:bg-orange-600 transition"
                      onClick={() => inc(p.id)}
                    >
                      +
                    </button>
                  </div>

                  {/* DESKTOP QUANTITY CONTROLS - Right aligned */}
                  <div className="hidden sm:flex items-center gap-2 justify-end flex-1">

                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition"
                      onClick={() => dec(p.id)}
                    >
                      -
                    </button>
                    <div className="w-6 text-center font-semibold">
                      {cart[p.id]?.quantity || 0}
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
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 
  text-white py-2 rounded-xl font-semibold hover:opacity-90"
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
        className="fixed bottom-4 inset-x-0 mx-auto w-[90%] max-w-md z-50"
      >

    <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between border border-orange-200">
      <div>
        <div className="font-semibold">{totalItems} items in cart</div>
        <div className="text-sm text-gray-600">Total: ₹{total}</div>
      </div>

      <button
        onClick={() => (window.location.hash = "cart")}
        className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold"
      >
        Go to Cart
      </button>
    </div>
  </motion.div>
)}


      </div>
    </div>
  );
}
