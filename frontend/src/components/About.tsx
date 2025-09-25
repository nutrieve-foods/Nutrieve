// import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users } from 'lucide-react'; 
import { FaHandshake } from "react-icons/fa"; 

const About = () => {
  return (
    <section
      id="about"
      className="relative py-20 text-white"
      style={{ backgroundImage: "url('/background image3.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            <span>🌱 Our Story</span>
          </div>

          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8 leading-snug">
            Empowering Communities Through
            <span className="block text-orange-400">Sustainable Agriculture</span>
          </h2>

          <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
            <p>
              Our journey began with a shared vision: to create a meaningful impact in agriculture while unlocking opportunities for rural communities. Despite being the backbone of livelihoods in India, women in rural areas often remain undervalued and underrepresented.
            </p>

            <p>
              We saw this as both a challenge and an opportunity — to build a model that combines sustainability, women-led participation, and fair value creation.
            </p>
          </div>

          {/* Mission Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Leaf,
                title: "Sustainable Sourcing",
                desc: "Responsible sourcing and processing of agricultural products."
              },
              {
                icon: Users,
                title: "Women Empowerment",
                desc: "Structured opportunities, training, and recognition for rural women."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <item.icon className="w-8 h-8 text-orange-400" />
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-200">{item.desc}</p>
              </motion.div>
            ))}

            {/* ✅ Trusted Quality Card with FaHandshake */}
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-white/10 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FaHandshake className="w-10 h-10 text-orange-500" />  
              <h3 className="text-xl font-semibold text-white mt-4">Trusted Quality</h3>
              <p className="text-gray-300 mt-2">
                We ensure pure authentic powders with no additives.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.pexels.com/photos/4911674/pexels-photo-4911674.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Rural women working in agriculture"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
