import { motion } from "framer-motion";
import { Leaf, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";




const FeaturedProducts = () => {
  interface CartEntry {
    quantity: number;
    cartItemId: number;
  }
  
  const [cart, setCart] = useState<Record<number, CartEntry>>({});
  
  const [products, setProducts] = useState<any[]>([]);
  const DISCOUNT_PERCENT = 30;

useEffect(() => {
  loadCart();
  loadFeaturedProducts();
}, []);

const loadFeaturedProducts = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/products`);
  const data = await res.json();

  // Pick 4 random products or your chosen 4
  setProducts(data.slice(0, 4));
};


const loadCart = async () => {
  const token = localStorage.getItem("nutrieve_token");
  if (!token) return;

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const res = await fetch(apiUrl + "/api/cart", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const cartMap: Record<number, { quantity: number; cartItemId: number }> = {};
  data.forEach((item: any) => {
    cartMap[item.product_id] = { quantity: item.quantity, cartItemId: item.id };
  });

  setCart(cartMap);
};

  
  useEffect(() => {
    loadCart();
  }, []);
  
  const addToCart = async (productId: number) => {
    const token = localStorage.getItem("nutrieve_token");
    if (!token) {
      window.location.hash = "login";
      return;
    }
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    const res = await fetch(`${apiUrl}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 1,
        size: "200gm",
      }),
    });
  
    const data = await res.json(); // backend returns newly created item
  
    setCart(prev => ({
      ...prev,
      [productId]: {
        quantity: (prev[productId]?.quantity || 0) + 1,
        cartItemId: data.id, // IMPORTANT
      },
    }));
  };
  
  
  const removeFromCart = async (productId: number) => {
    const token = localStorage.getItem("nutrieve_token");
    if (!token) return;
  
    const entry = cart[productId];
    if (!entry) return;
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    // If quantity becomes zero → DELETE item
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
  
    // Otherwise → reduce quantity by 1
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
  
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="products"
      className="py-20"
      style={{
        backgroundImage: `
        linear-gradient(rgba(255,165,0,0.2), rgba(255,255,255,0.2)),
        url("/products.jpg")
      `,
        backgroundColor: "#fff5e6",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked selection of our most popular powder blends
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-4 
            gap-6 
          "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="
                group bg-white rounded-xl shadow-md 
                hover:shadow-xl transition-all duration-300 
                overflow-hidden border border-gray-100
              "
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image ? `/${product.image}` : "/products.jpg"}

                  
                  className="
                    w-full 
                    h-40 object-cover 
                    md:h-64 
                    group-hover:scale-105 
                    transition-transform duration-500
                  "
                />
                {/* Organic Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white shadow-sm rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 md:p-6">
                <h3 className="font-playfair text-lg md:text-xl font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm md:text-base mb-3 line-clamp-2">
                  {product.description}
                </p>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                ₹{product.base_price.toFixed(0)}
              </span>

              <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">
                {DISCOUNT_PERCENT}% OFF
              </span>
            </div>

            <div className="text-xl md:text-2xl font-bold text-gray-900">
              ₹{(product.base_price * (1 - DISCOUNT_PERCENT / 100)).toFixed(0)}
            </div>

            <div className="text-xs text-green-600 font-medium mt-0.5">
              New Year Offer
            </div>

            <div className="text-xs text-gray-500 mt-1">
              ₹{(product.base_price / 10).toFixed(0)} per 100g
            </div>
          </div>


                {/* Add to Cart */}
                {/* If item is in cart → show quantity controls */}
    {cart[product.id] ? (
      <div className="flex items-center justify-between mt-2">
        <button
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
          onClick={() => removeFromCart(product.id)}
        >
          -
        </button>

        <span className="font-semibold text-lg">{cart[product.id]?.quantity}</span>
      

        <button
          className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center"
          onClick={() => addToCart(product.id)}
        >
          +
        </button>
        </div>
      ) : (
        <motion.button
          onClick={() => addToCart(product.id)}
          className="
            w-full bg-gradient-to-r from-orange-500 to-red-500 
            text-white py-2.5 md:py-3 rounded-lg md:rounded-xl 
            font-semibold hover:from-orange-600 hover:to-red-600 
            shadow-md hover:shadow-lg transition-all duration-300
          "
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        > 
          Add to Cart
        </motion.button>
      )}

      {/* View Details Button */}
      {cart[product.id] && (
        <button
          onClick={() => (window.location.hash = `product/${product.id}`)}
          className="w-full mt-3 bg-white border text-orange-600 px-4 py-2 rounded-xl font-semibold hover:bg-orange-50 transition"
        >
          View Details
        </button>
      )}

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Products */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.button
            className="
              group inline-flex items-center space-x-2 bg-transparent border-2 border-white 
  text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white 
  transition-all duration-300 max-w-full
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              window.location.hash = "products";
            }}
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
