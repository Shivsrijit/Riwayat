import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';


const AddDestinationForm: React.FC = () => {
  const { token, user } = useAuth();
  const [form, setForm] = useState({ name: '', englishName: '', description: '', image: '', region: '', bestTime: '', heritage: '', entryFee: '', link: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!user) return <div className="text-center text-gray-500">Please log in to add a destination.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:4000/api/destinations', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Destination added!');
      setForm({ name: '', englishName: '', description: '', image: '', region: '', bestTime: '', heritage: '', entryFee: '', link: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add destination');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold mb-2">Add New Destination</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-3 py-2 border rounded" required />
      <input name="englishName" value={form.englishName} onChange={handleChange} placeholder="English Name" className="w-full px-3 py-2 border rounded" />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded" required />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full px-3 py-2 border rounded" />
      <input name="region" value={form.region} onChange={handleChange} placeholder="Region" className="w-full px-3 py-2 border rounded" />
      <input name="bestTime" value={form.bestTime} onChange={handleChange} placeholder="Best Time to Visit" className="w-full px-3 py-2 border rounded" />
      <input name="heritage" value={form.heritage} onChange={handleChange} placeholder="Heritage" className="w-full px-3 py-2 border rounded" />
      <input name="entryFee" value={form.entryFee} onChange={handleChange} placeholder="Entry Fee" className="w-full px-3 py-2 border rounded" />
      <input name="link" value={form.link} onChange={handleChange} placeholder="Official Link" className="w-full px-3 py-2 border rounded" />
      <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition">Add Destination</button>
      {success && <div className="text-green-600 text-center">{success}</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
    </form>
  );
};

export default AddDestinationForm; 
