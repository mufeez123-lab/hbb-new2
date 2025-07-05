import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface Director {
  _id: string;
  name: string;
  position: string;
  image: string;
}

const BoardOfDirectorsPage: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const getImageUrl = (path: string) => {
  if (path.startsWith('http')) return path;

  const baseUrl = "https://hbb-new2.vercel.app";
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};


  useEffect(() => {
    api.get('/admin/board')
      .then((res) => setDirectors(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.position) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('position', formData.position);
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editingId) {
        await api.put(`/admin/board/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/board', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      const updated = await api.get('/admin/board');
      setDirectors(updated.data);
      setOpen(false);
      setSelectedFile(null);
      setFormData({ name: '', position: '' });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/board/${id}`);
      setDirectors(directors.filter((d) => d._id !== id));
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
              <h1 className="text-2xl font-semibold">Board of Directors</h1>
              <button
                onClick={() => {
                  setOpen(true);
                  setFormData({ name: '', position: '' });
                  setSelectedFile(null);
                  setEditingId(null);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Director
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {directors.map((director) => (
                <div key={director._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={getImageUrl(director.image)}
                      alt={director.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{director.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{director.position}</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setFormData({ name: director.name, position: director.position });
                          setSelectedFile(null);
                          setOpen(true);
                          setEditingId(director._id);
                        }}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l9-9a1.414 1.414 0 00-2-2l-9 9v3zM16 21H4a1 1 0 01-1-1v-6a1 1 0 011-1h2" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(director._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete"
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
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Update Director' : 'Add New Director'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.position}
                  className={`px-4 py-2 rounded-md text-white ${
                    formData.name && formData.position
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editingId ? 'Update' : 'Add Director'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardOfDirectorsPage;