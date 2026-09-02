import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthForm: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'artist' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        await login(form.email, form.password);
        setSuccess('Logged in!');
      } else {
        await register(form.name, form.email, form.password, form.role);
        setSuccess('Registered and logged in!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 border rounded" required />
        )}
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full px-3 py-2 border rounded" required />
        {!isLogin && (
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
            <option value="artist">Artist</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => setIsLogin(!isLogin)} className="text-orange-600 hover:underline">
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
      {success && <div className="text-green-600 mt-2 text-center">{success}</div>}
    </div>
  );
};

export default AuthForm; 