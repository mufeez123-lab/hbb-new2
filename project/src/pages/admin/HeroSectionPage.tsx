import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface HeroImage {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  order: number;
}

const HeroSectionPage: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    order: 0
  });

  useEffect(() => {
    api.get('/hero')
      .then((res) => setHeroImages(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const data = new FormData();
    data.append('image', selectedFile);
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('order', formData.order.toString());

    try {
      const res = await api.post('/admin/hero', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setHeroImages([...heroImages, res.data]);
      setOpen(false);
      setSelectedFile(null);
      setFormData({ title: '', subtitle: '', order: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/hero/${id}`);
      setHeroImages(heroImages.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 ml-64">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Hero Section</h1>
              <button
                onClick={() => setOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Hero Image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroImages.map((hero) => (
                <div key={hero._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={hero.image}
                      alt={hero.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{hero.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{hero.subtitle}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Order: {hero.order}</span>
                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Hero Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || !formData.title}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFile && formData.title
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSectionPage; 