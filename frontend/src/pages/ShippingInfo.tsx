import { motion } from "framer-motion";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
            Shipping & Delivery
          </h1>

          <p className="text-gray-700 leading-7 mb-4">
            We deliver fresh, high-quality products across Pan India.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Time</h2>
          <p className="text-gray-700">
            Orders are dispatched within 24 hours. Delivery takes 2–7 business days.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Tracking</h2>
          <p className="text-gray-700">
            You will receive a tracking ID once your order is shipped.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
          <p className="text-gray-700">📧 support@nutrieve.com</p>
        </motion.div>
      </div>
    </div>
  );
}
