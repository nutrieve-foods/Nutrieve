import { motion } from 'framer-motion';
import { Leaf, Shield, Heart, Sparkles, Users, Globe } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: 'Pure & Authentic',
      description:
        'Blended without harmful preservatives or chemicals, ensuring true natural flavors.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description:
        'Every batch goes through strict quality checks and certifications for purity.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Heart,
      title: 'Health Benefits',
      description:
        'Rich in antioxidants and natural compounds that support everyday wellness.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Authentic Taste',
      description:
        'Traditional Indian recipes preserved for generations to deliver true taste.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Fair Trade',
      description:
        'We support local farmers with fair wages and sustainable farming practices.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Globe,
      title: 'Eco-Friendly',
      description:
        'Sustainable packaging and responsible sourcing to protect the planet.',
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      id="benefits"
      className="relative py-16 md:py-20 bg-gradient-to-br from-orange-50 via-orange-100 to-red-50"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            What Makes Us Different?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the richness of authentic Indian flavors crafted with purity & passion.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="
                group bg-white p-6 md:p-8 
                rounded-2xl shadow-md hover:shadow-2xl
                border border-gray-100 
                transition-all duration-300
              "
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              {/* Icon */}
              <motion.div
                className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${benefit.color}
                  rounded-2xl flex items-center justify-center mb-6 
                  group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </motion.div>

              {/* Text */}
              <h3 className="font-playfair text-xl font-semibold text-gray-800 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {benefit.description}
              </p>

              {/* Bottom line hover */}
              <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`h-1 bg-gradient-to-r ${benefit.color} rounded-full`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-14 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border border-gray-100">
            <h3 className="font-playfair text-2xl font-semibold text-gray-800 mb-3">
              Ready to Experience True Flavors?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of families switching to authentic Indian spices.
            </p>
            <motion.button
              className="
                bg-gradient-to-r from-orange-500 to-red-600 
                text-white px-8 py-3 rounded-full 
                font-semibold hover:from-orange-600 hover:to-red-700 
                transition-all duration-300 shadow-lg hover:shadow-xl
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.hash = 'products')}
            >
              Shop Authentic Powders
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
