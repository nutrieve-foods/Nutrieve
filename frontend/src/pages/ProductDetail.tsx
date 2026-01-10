import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Zap, Leaf, Shield, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

type Product = {
  id: number;
  name: string;
  description: string;
  base_price: number;
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
  const [quantity, setQuantity] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItemId, setCartItemId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadProduct();
    loadCartQuantity();
  }, [productId]);

  useEffect(() => {
    const handler = () => loadCartQuantity();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  

  const loadProduct = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/products`);
      const products = await response.json();
      const found = products.find((p: Product) => p.id === parseInt(productId));
      setProduct(found || null);
    } catch (e) {
      console.error("Failed to load", e);
    } finally {
      setLoading(false);
    }
  };

  const loadCartQuantity = async () => {
    const token = localStorage.getItem("nutrieve_token");
    if (!token) return;
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    const res = await fetch(apiUrl + "/api/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await res.json();
  
    // Find entry of SAME PRODUCT + SAME SIZE
    const item = data.find(
      (i: any) =>
        i.product_id === parseInt(productId) &&
        i.size === selectedSize
    );
  
    if (item) {
      setQuantity(item.quantity);
      setCartItemId(item.id);
    } else {
      setQuantity(0);
      setCartItemId(null);
    }
  };
  useEffect(() => {
    loadCartQuantity();
  }, [selectedSize]);
  

  const calculatePrice = (base: number, size: string) => {
    const multiplier: any = { "200gm": 0.2, "500gm": 0.5, "2kg": 2.0, "10kg": 10.0 };
    return base * (multiplier[size] || 1);
  };

  const addToCart = async () => {
    if (!product) return;
  
    const token = localStorage.getItem("nutrieve_token");
    if (!token) {
      window.location.hash = "login";
      return;
    }
  
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
    // If item exists → UPDATE
    if (cartItemId) {
      await fetch(`${apiUrl}/api/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
  
      alert(`${quantity} × ${selectedSize} updated in your cart`);
      return;
    }
  
    // Else → CREATE new entry
    const res = await fetch(`${apiUrl}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity,
        size: selectedSize,
      }),
    });
  
    const data = await res.json();
    setCartItemId(data.id);
  
    alert(`${quantity} × ${selectedSize} added to your cart`);
  };
  
  
   
  

  const buyNow = async () => {
    await addToCart();
    window.location.hash = "cart";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin h-20 w-20 border-b-2 border-orange-500 rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div>
          <h2 className="text-xl font-bold">Product Not Found</h2>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product ? `${product.name} | Nutrieve` : 'Product Details | Nutrieve'}</title>
        <meta
          name="description"
          content={product ? `${product.description || `Buy ${product.name} powder online. Premium quality, natural, and hygienic vegetable powder from Nutrieve.`}` : 'View product details and specifications on Nutrieve.'}
        />
        <meta
          name="keywords"
          content={`${product?.name || 'product'}, vegetable powder, Nutrieve, natural food products, dehydrated vegetables`}
        />
        <link rel="canonical" href={`https://www.nutrieve.in/#product/${productId}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={product ? `${product.name} | Nutrieve` : 'Product Details | Nutrieve'} />
        <meta
          property="og:description"
          content={product ? `${product.description || `Premium quality ${product.name} powder from Nutrieve.`}` : 'View product details on Nutrieve.'}
        />
        <meta property="og:url" content={`https://www.nutrieve.in/#product/${productId}`} />
        {product?.image && <meta property="og:image" content={`https://www.nutrieve.in/${product.image}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product ? `${product.name} | Nutrieve` : 'Product Details | Nutrieve'} />
        <meta
          name="twitter:description"
          content={product ? `${product.description || `Premium quality ${product.name} powder.`}` : 'View product details on Nutrieve.'}
        />
        {product?.image && <meta name="twitter:image" content={`https://www.nutrieve.in/${product.image}`} />}
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* IMAGE SECTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <div
              className="
                bg-white rounded-xl shadow-lg p-4 
                sticky top-4 
              "
            >
              {/* FULL WIDTH MOBILE IMAGE */}
              <img
                src={`/${product.image}`} 
                alt={product.name}
                className="
                  rounded-xl 
                  w-full 
                  h-72 sm:h-96 object-cover 
                  md:rounded-2xl
                "
              />
            </div>
          </motion.div>

          {/* DETAILS SECTION */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Title, description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-3">
                {product.name}
              </h1>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* STARS */}
              <div className="flex items-center space-x-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-600">(4.9)</span>
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {["200gm", "500gm", "2kg", "10kg"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`
                      p-4 rounded-xl border-2 text-center
                      ${selectedSize === s
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200"
                      }
                    `}
                  >
                    <div className="font-semibold">{s}</div>
                    <div className="text-gray-600 text-sm">₹{calculatePrice(product.base_price, s)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>

              <div className="flex items-center gap-4">
              <button
  onClick={async () => {
    if (quantity === 0) return;

    const token = localStorage.getItem("nutrieve_token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

    if (quantity === 1) {
      // Delete entry
      await fetch(`${apiUrl}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuantity(0);
      setCartItemId(null);
      return;
    }

    // Update quantity
    await fetch(`${apiUrl}/api/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: quantity - 1 }),
          });

          setQuantity(quantity - 1);
        }}
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
      >
        -
      </button>



                      <span className="text-xl font-semibold">{quantity}</span>

                      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center"
      >
        +
      </button>
              </div>
            </div>

            
            {/* PRICE */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

              {/* OFFER BADGE */}
              <div className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded">
                Launching Offer
              </div>

              {/* PRICE ROW */}
              <div className="flex items-end gap-3">
                <span className="text-red-600 text-lg font-semibold">-30%</span>

                <span className="text-3xl font-bold text-gray-900">
                  ₹{(
                    calculatePrice(product.base_price, selectedSize) *
                    quantity *
                    0.7
                  ).toFixed(0)}
                </span>

                <span className="text-gray-500 line-through text-lg">
                  ₹{(
                    calculatePrice(product.base_price, selectedSize) *
                    quantity
                  ).toFixed(0)}
                </span>
              </div>

              {/* PRICE PER 100g */}
              <div className="text-sm text-gray-600 mt-1">
                ₹{(product.base_price / 10).toFixed(0)} / 100g
              </div>

              {/* UNIT PRICE */}
              <div className="text-gray-500 text-sm">
                ₹{calculatePrice(product.base_price, selectedSize)} per {selectedSize}
              </div>

              </div>


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCart}
                className="flex-1 py-4 border-2 border-orange-500 rounded-xl text-orange-600 font-semibold"
              >
                Add to Cart
              </button>

              <button
                onClick={buyNow}
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold"
              >
                Buy Now
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
