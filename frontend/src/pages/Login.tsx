import { useState } from 'react';

type Props = { onSignedIn?: () => void };

export default function Login({ onSignedIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const r = await fetch((import.meta as any).env?.VITE_API_URL + '/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!r.ok) throw new Error('Login failed');
      const user = await r.json();
      localStorage.setItem('nutrieve_user', JSON.stringify(user));
      onSignedIn?.();
    } catch (e: any) { setError(e.message || 'Login failed'); }
  }

  return (
    <section className="py-20" style={{ backgroundImage: 'url("/background image3.jpeg")' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/90 rounded-2xl shadow-lg p-8">
          <h2 className="font-playfair text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="w-full border px-4 py-3 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full border px-4 py-3 rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold">Sign In</button>
          </form>
        </div>
      </div>
    </section>
  );
}


