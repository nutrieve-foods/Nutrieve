import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rohit Gokhale',
      location: 'Hyderabad, India',
      rating: 5,
      text: "The ginger and garlic powders are so fresh and aromatic that I barely need to use much – a little goes a long way. My curries taste richer and more balanced compared to the usual market spices.",
      image: '/profile picture.jpeg'
    
    
    
    },
    {
      id: 2,
      name: 'Vedant Naik',
      location: 'Nagpur, India',
      rating: 5,
      text: "I’m really impressed with the lemon and neem powders. The lemon adds a natural tangy freshness, while the neem feels so pure and earthy – I even use it for health remedies apart from cooking."
,
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'Anita Patel',
      location: 'Ahmedabad, India',
      rating: 5,
      text: "I recently tried the onion and tomato powders, and I must say they’re a lifesaver. No more chopping or waiting it is just pure flavor, and it blends beautifully in both gravies and dry dishes.",
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
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
    <section 
  className="relative py-20 bg-gray-900 text-white"
  style={{ backgroundImage: "url('/images/testimonials-bg.jpg')" }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
    <motion.div
      className="text-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
        What Our Customers Say
      </h2>
      <p className="text-xl text-gray-200 max-w-2xl mx-auto">
        Real stories from families who have experienced the difference of blends with no preservatives add but with real essence.
      </p>
    </motion.div>

    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          className="group bg-gray-800/80 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ y: -8 }}
        >
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Quote className="w-16 h-16 text-orange-500" />
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>

          {/* Testimonial Text */}
          <p className="text-gray-200 leading-relaxed mb-6 relative z-10">
            "{testimonial.text}"
          </p>

          {/* Customer Info */}
          <div className="flex items-center space-x-4">
            <motion.img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
              whileHover={{ scale: 1.1 }}
            />
            <div>
              <h4 className="font-semibold text-white">
                {testimonial.name}
              </h4>
              <p className="text-sm text-gray-400">
                {testimonial.location}
              </p>
            </div>
          </div>

          {/* Decorative Element */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          />
        </motion.div>
      ))}
    </motion.div>

    {/* Trust Indicators */}
    <motion.div
      className="mt-16 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-2xl text-white">
        <h3 className="font-playfair text-2xl font-semibold mb-4">
          Join 500+ Happy Customers
        </h3>
        <p className="text-orange-100 mb-6">
          Experience the true taste of India with our premium traditional blends.
        </p>
        <div className="flex justify-center items-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold">4.9★</div>
            <div className="text-sm text-orange-100">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">100+</div>
            <div className="text-sm text-orange-100">Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">97%</div>
            <div className="text-sm text-orange-100">Satisfaction</div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

  );
};

export default Testimonials;