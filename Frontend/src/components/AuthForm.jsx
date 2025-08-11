import React, { useState } from 'react';
import api from '../api';

export default function AuthForm({ type, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { email, password });
      localStorage.setItem('token', res.data.token);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      <input
        id="email"
        name="email"
        autoComplete="email"
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      
      <input
        id="password"
        name="password"
        autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
      >
        {loading ? 'Processing...' : type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
