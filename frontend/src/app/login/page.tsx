'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await axios.post(url, payload);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {isLogin ? 'Sign in to your dashboard' : 'Sign up to get started'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider">{"Full Name"}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">{"Email"}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">{"Password"}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors mt-2"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-indigo-400 hover:text-indigo-300 ml-1 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  );
}