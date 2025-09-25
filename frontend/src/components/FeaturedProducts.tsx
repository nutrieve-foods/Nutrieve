// import React from 'react';
import { motion } from 'framer-motion';
import { Star, Leaf, ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Onion Powder',
      price: '₹230',
      originalPrice: '₹399',
      image: '/Onion Powder.jpg',
      // rating: 4.9,
      // reviews: 234,
      // badge: 'Best Seller',
      description: 'Rich, savory depth in every sprinkle'
    },
    {
      id: 2,
      name: 'Tomato Powder',
      price: '₹185',
      originalPrice: '₹329',
      image: '/Tomato Powder.jpg',
      // rating: 4.8,
      // reviews: 189,
      // badge: 'New',
      description: 'Tangy zest for sauces and soups'
    },
    {
      id: 3,
      name: 'Garlic Powder',
      price: '₹375',
      originalPrice: '₹359',
      image: '/Garlic Powder.jpg',
      // rating: 4.9,
      // reviews: 156,
      // badge: 'Premium',
      description: 'Bold aroma for instant flavor'
    },
    {
      id: 4,
      name: 'Lemon Powder',
      price: '₹180',
      originalPrice: '₹299',
      image: '/Lemon Powder.jpg',
      // rating: 4.7,
      // reviews: 203,
      // badge: 'Organic',
      description: 'Citrusy brightness in a dash'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="products" className="py-20" style={{  backgroundImage: `
      linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
      url("https://www.transparenttextures.com/patterns/wood-pattern.png")
    `,
    backgroundColor: '#6b4226', }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Handpicked selection of our most popular powder blends
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                


                {/* Badge */}
                {/* <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  product.badge === 'Best Seller' ? 'bg-orange-500 text-white' :
                  product.badge === 'New' ? 'bg-green-500 text-white' :
                  product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                  'bg-emerald-500 text-white'
                }`}>
                  {product.badge}
                </div> */}

                {/* Organic Icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                    {/* <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div> */}
                  {/* <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span> */}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800">
                      {product.price}
                    </span>
                    {/* <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice}
                    </span> */}
                  </div>
                  {/* <div className="text-sm text-green-600 font-semibold">
                    Save {Math.round(((parseInt(product.originalPrice.slice(1)) - parseInt(product.price.slice(1))) / parseInt(product.originalPrice.slice(1))) * 100)}%
                  </div> */}
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Products Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.button
            className="group inline-flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { window.location.hash = '/products'; }}
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