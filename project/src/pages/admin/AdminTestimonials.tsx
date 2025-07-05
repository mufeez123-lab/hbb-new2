import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

interface Testimonial {
  _id?: string;
  name: string;
  title: string;
  quote: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Testimonial>({ name: '', title: '', quote: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await api.put(`/testimonials/${editId}`, form);
      } else {
        await api.post('/testimonials', form);
      }
      setForm({ name: '', title: '', quote: '' });
      setIsEditing(false);
      setEditId(null);
      fetchTestimonials();
    } catch (err) {
      console.error('Error saving testimonial:', err);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setForm(testimonial);
    setEditId(testimonial._id || null);
    setIsEditing(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow border">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full p-3 border rounded focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Title (e.g. Owner of Prestige White Meadows)"
            className="w-full p-3 border rounded focus:outline-none"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <textarea
          placeholder="Quote"
          className="w-full p-3 border rounded focus:outline-none"
          rows={4}
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-4">Testimonials List</h3>
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="p-4 bg-gray-50 rounded shadow flex justify-between items-start border"
          >
            <div className="flex-1">
              <p className="text-lg font-bold">{testimonial.name}</p>
              <p className="text-sm text-gray-600 italic">{testimonial.title}</p>
              <p className="text-gray-700 mt-1">"{testimonial.quote}"</p>
            </div>
            <div className="flex space-x-2 mt-1 ml-4">
              <button onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:text-blue-800">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(testimonial._id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
