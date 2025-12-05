import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
            Terms & Conditions
          </h1>

          <p className="text-gray-700 leading-7 mb-4">
            Welcome to Nutrieve. By accessing our website or placing an order,
            you agree to the following Terms & Conditions.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. General</h2>
          <p className="text-gray-700 leading-7">
            By placing an order, you confirm that you are 18+ or supervised by a guardian.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Products</h2>
          <p className="text-gray-700 leading-7">
            All products are subject to availability. Some variations may occur.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Pricing</h2>
          <p className="text-gray-700 leading-7">
            All prices are in INR and inclusive of applicable taxes.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Shipping</h2>
          <p className="text-gray-700 leading-7">
            We deliver Pan India using trusted partners.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Returns & Refunds</h2>
          <p className="text-gray-700 leading-7">
            Due to perishable nature, returns are not accepted. Refunds only for damaged/incorrect items.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Contact</h2>
          <p className="text-gray-700">
            📧 support@nutrieve.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}
