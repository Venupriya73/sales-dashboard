'use client';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/');
    }
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (!isLogin && !name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    try {
      const url = isLogin
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;
      const payload = isLogin ? { email, password } : { name, email, password };
      const { data } = await axios.post(url, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "text-xs text-gray-400 uppercase tracking-wider block mb-1";

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sales Analytics</h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={inputClass}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}