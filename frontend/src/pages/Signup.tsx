import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
// import { useNavigate } from 'react-router-dom';

type Props = { onSignedUp?: () => void };

export default function Signup({ onSignedUp }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';
      const r = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      
      if (!r.ok) {
        const errorJson = await r.json().catch(() => null);

        if (errorJson?.detail === "Email already registered") {
          throw new Error("This email is already registered. Please log in or use a different email.");
        }

        throw new Error("Unable to create account. Please try again.");

      }
      
      const data = await r.json();
      localStorage.setItem('nutrieve_user', JSON.stringify(data.user));
      localStorage.setItem('nutrieve_token', data.access_token);
      onSignedUp?.();
    } catch (e: any) { 
      setError(e.message || 'Signup failed'); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign Up | Create Account | Nutrieve</title>
        <meta
          name="description"
          content="Create your Nutrieve account to start shopping premium vegetable powders. Join us for natural, hygienic, and nutrient-rich food products."
        />
        <meta
          name="keywords"
          content="Nutrieve signup, create account, vegetable powder registration, Nutrieve account"
        />
        <link rel="canonical" href="https://www.nutrieve.in/#signup" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sign Up | Create Account | Nutrieve" />
        <meta
          property="og:description"
          content="Create your Nutrieve account to start shopping premium vegetable powders."
        />
        <meta property="og:url" content="https://www.nutrieve.in/#signup" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign Up | Create Account | Nutrieve" />
        <meta
          name="twitter:description"
          content="Create your Nutrieve account to start shopping premium vegetable powders."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-2">Join Nutrieve</h2>
            <p className="text-gray-600">Create your account to start shopping</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="Enter your full name" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="Enter your phone number" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => window.location.hash = '/login'}
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}