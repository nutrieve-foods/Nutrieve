import { motion } from "framer-motion";

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
            Return & Refund Policy
          </h1>

          <p className="text-gray-700 leading-7 mb-4">
            Due to the perishable nature of our products, we do not accept returns.
            Refunds are available only for damaged or incorrect items reported within 24 hours.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Refund Eligibility</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Product damaged or defective</li>
            <li>Wrong item delivered</li>
            <li>Report within 24 hours</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Non-refundable Cases</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Claims after 24 hours</li>
            <li>Used or partially consumed items</li>
            <li>Incorrect address provided by customer</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
          <p className="text-gray-700">
            📧 support@nutrieve.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}
