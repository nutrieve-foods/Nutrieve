import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Story', href: '#about' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' }
    ],
    products: [
      { name: 'All Products', href: '#products' },
      { name: 'Spice Powders', href: '#products' },
      { name: 'Herbal Powders', href: '#products' },
      { name: 'Wellness Blends', href: '#products' }
    ],
    support: [
      { name: 'Contact Us', href: '#contact' },
      { name: 'FAQ', href: '#' },
      { name: 'Shipping Info', href: 'shipping' },
      { name: 'Returns', href: 'returns' }
    ],
    legal: [
      { name: 'Privacy Policy', href: 'privacy-policy' },
      { name: 'Terms of Service', href: 'terms' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: 'disclaimer' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', name: 'YouTube' }
  ];

  // ⭐ function to navigate using your hash routing
  const goTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="font-playfair text-2xl font-bold mb-4">
                  <span className="gradient-text">Nutrieve</span>
                </h3>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  Premium spice powders crafted with three generations of expertise. 
                  Bringing authentic Indian flavors to your kitchen with uncompromising quality.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-300">+91 7219206711</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-300">info@nutrieve.in</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span className="text-sm text-gray-300">
                      At & Post Khairwani, Taluka Multai,<br />
                      District Betul, Madhya Pradesh, 460663
                    </span>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Company + Products (Merged Section) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-lg mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => (window.location.hash = "about")}
                    className="text-gray-300 hover:text-orange-500 transition-colors text-sm"
                  >
                    About Us
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => (window.location.hash = "products")}
                    className="text-gray-300 hover:text-orange-500 transition-colors text-sm"
                  >
                    All Products
                  </button>
                </li>
              </ul>
            </motion.div>


            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => goTo(link.href)}
                      className="text-gray-300 hover:text-orange-500 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => goTo(link.href)}
                      className="text-gray-300 hover:text-orange-500 text-sm"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-800 py-8 text-center text-gray-400 text-sm">
          © 2025 Nutrieve. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
