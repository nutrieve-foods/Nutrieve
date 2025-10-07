import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, Download } from 'lucide-react';

type Props = {
  orderId: number;
};

export default function OrderSuccess({ orderId }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-playfair text-3xl font-bold text-gray-800 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your order. Your order ID is:
            </p>
            <p className="text-2xl font-bold text-orange-600 mb-8">
              #{orderId.toString().padStart(6, '0')}
            </p>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">1</span>
                </div>
                <p className="text-gray-600">Order confirmation email sent</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">2</span>
                </div>
                <p className="text-gray-600">Order processing (1-2 business days)</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">3</span>
                </div>
                <p className="text-gray-600">Shipped and tracking details shared</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">4</span>
                </div>
                <p className="text-gray-600">Delivered to your doorstep (3-5 days)</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => window.location.hash = '/dashboard'}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => window.location.hash = '/products'}
              className="flex-1 border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </motion.div>

          {/* Download Invoice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 pt-6 border-t"
          >
            <button className="text-gray-600 hover:text-orange-600 transition-colors flex items-center space-x-2 mx-auto">
              <Download className="w-4 h-4" />
              <span className="text-sm">Download Invoice</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}