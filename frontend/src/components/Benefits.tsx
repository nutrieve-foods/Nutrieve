import { motion } from 'framer-motion';
import { Leaf, Shield, Heart, Sparkles, Users, Globe } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: 'Pure & Authentic',
      description: 'Blended without harmful preservatives & chemicals, ensuring wholesome flavors in every blend.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Rigorous testing and certification processes guarantee the highest quality standards.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Heart,
      title: 'Health Benefits',
      description: 'Rich in antioxidants and natural compounds that support overall wellness and vitality.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Authentic Taste',
      description: 'Traditional recipes preserved for generations deliver genuine Indian flavors.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Fair Trade',
      description: 'Supporting local farmers with fair wages and sustainable farming practices.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Globe,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging and carbon-neutral shipping for environmental responsibility.',
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
      className="relative py-20 bg-gradient-to-br from-white via-orange-50 to-white"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What makes us different?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference that true, traditional flavors bring to your cooking and your health
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 5 }}
              >
                <benefit.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Accent Line */}
              <motion.div
                className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className={`h-1 bg-gradient-to-r ${benefit.color} rounded-full`}></div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto border border-gray-100">
            <h3 className="font-playfair text-2xl font-semibold text-gray-900 mb-4">
              Ready to Experience true Flavors?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of families who have switched to traditional Indian flavors
            </p>
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.location.hash = '/products'; }}
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
