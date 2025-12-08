import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden 
                 bg-gradient-to-r from-orange-50 to-white pt-20 md:pt-0"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/Home_page_new.png")',
        }}
      >
        <div className="absolute inset-0 bg-white/70 md:bg-white/60 backdrop-blur-[2px]" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 md:w-4 md:h-4 bg-orange-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 
                     border border-orange-200 rounded-full px-5 py-1.5 mb-6 shadow-sm text-sm md:text-base"
        >
          <Star className="w-4 h-4 text-orange-500" />
          <span>100% Certified</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-playfair font-bold text-4xl leading-tight text-gray-800 mb-4
                     sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Authentic Indian
          <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Powders
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Discover the pure essence of traditional Indian flavors — crafted with passion,
          purity, and timeless recipes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.button
            className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-7 py-3 
                       sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-md 
                       hover:shadow-xl transition-all flex items-center space-x-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.hash = "products")}
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            className="border-2 border-orange-400 text-orange-600 px-7 py-3 
                       sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg 
                       hover:bg-orange-100 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-6 sm:gap-10 mt-12 sm:mt-16 max-w-sm sm:max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {[
            { number: '25+', label: 'Genuine Blends' },
            { number: '500+', label: 'Happy Customers' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-700 text-sm sm:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-orange-300 rounded-full flex justify-center">
          <div className="w-1 h-2.5 md:h-3 bg-orange-400 rounded-full mt-2"></div>
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;
