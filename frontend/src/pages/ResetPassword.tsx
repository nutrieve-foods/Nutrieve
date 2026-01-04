import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email || !otp || !password) {
      setMsg("Please fill in all fields to reset your password.");
      return;
    }
  
    if (password.length < 8) {
      setMsg("Password must be at least 8 characters long.");
      return;
    }
  
    setLoading(true);
    setMsg("");
  
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const r = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          new_password: password,
        }),
      });
  
      const data = await r.json();
  
      if (!r.ok) {
        throw new Error(data.detail || "Invalid or expired verification code.");
      }
  
      setMsg("Your password has been reset successfully. Redirecting to login…");
  
      setTimeout(() => {
        window.location.hash = "login";
      }, 1500);
  
    } catch (e: any) {
      setMsg(
        e.message ||
          "We couldn't reset your password. Please verify the OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter the OTP sent to your email and set a new password.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {msg && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-orange-700">
                {msg}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Remembered your password?{" "}
              <button
                onClick={() => (window.location.hash = "login")}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Back to Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
