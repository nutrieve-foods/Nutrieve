import { motion } from "framer-motion";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
            Disclaimer
          </h1>

          <p className="text-gray-700 leading-7">
            The information on this website is for general purposes only.
            Nutrieve makes no warranties regarding accuracy or completeness.
          </p>

          <p className="text-gray-700 mt-4 leading-7">
            Product photographs may differ slightly from actual products.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
