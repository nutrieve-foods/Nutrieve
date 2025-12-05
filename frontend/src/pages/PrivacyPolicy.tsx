import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="font-playfair text-4xl font-bold text-gray-800 mb-6">
            Privacy Policy
          </h1>

          <p className="text-gray-700 leading-7 mb-4">
            At Nutrieve, we respect your privacy and are committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, and safeguard your information when you interact with
            our website, place an order, or communicate with us.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Personal Information: Name, phone number, email, address</li>
            <li>Payment Information (processed securely by third-party gateways)</li>
            <li>Order Details: items purchased, history</li>
            <li>Technical Info: IP address, browser, device details</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Process and deliver orders</li>
            <li>Communicate regarding purchases</li>
            <li>Improve website & user experience</li>
            <li>Send promotional offers (with consent)</li>
            <li>Fraud prevention & legal compliance</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. Sharing of Information</h2>
          <p className="text-gray-700">We do NOT sell or rent your information. We only share it with:</p>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Delivery partners</li>
            <li>Payment gateways</li>
            <li>Legal authorities if required</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
          <p className="text-gray-700">
            We use secure, modern practices to protect your data from unauthorized access.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies & Tracking</h2>
          <p className="text-gray-700">
            Our website may use cookies to enhance browsing experience and track usage.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
          <ul className="list-disc ml-6 text-gray-700 leading-7">
            <li>Request your data</li>
            <li>Request deletion or correction</li>
            <li>Withdraw promotional consent</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact Us</h2>
          <p className="text-gray-700">
            For any privacy concerns, reach us at:
            <br />📧 support@nutrieve.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}
