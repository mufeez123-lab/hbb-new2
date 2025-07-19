import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';


interface Director {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  image: {
    url: string;
    public_id?: string;
  };
}

const BoardOfDirectorsPage: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      const res = await api.get('/admin/board', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDirectors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.position || (!selectedFile && !editingId)) {
      alert('All fields including image are required!');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('position', formData.position);
    data.append('bio', formData.bio);
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editingId) {
        await api.put(`/admin/board/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('✅ Director updated successfully');
      } else {
        await api.post('/admin/board', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('✅ Director added successfully');
      }

      await fetchDirectors();
      setOpen(false);
      setSelectedFile(null);
      setFormData({ name: '', position: '', bio: '' });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      toast.error('❌ Something went wrong. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDirectors((prev) => prev.filter((d) => d._id !== id));
      toast.success('🗑️ Director deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to delete. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 ">
          <div className="max-w-6xl mx-auto mt-20">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Board of Directors</h1>
              <button
                onClick={() => {
                  setOpen(true);
                  setFormData({ name: '', position: '', bio: '' });
                  setSelectedFile(null);
                  setEditingId(null);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"
              >
                Add Director
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {directors.map((director) => (
                <div key={director._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={director.image?.url}
                      alt={director.name}
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{director.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">{director.position}</p>
                    {director.bio && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-3">{director.bio}</p>
                    )}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => {
                          setFormData({
                            name: director.name,
                            position: director.position,
                            bio: director.bio || '',
                          });
                          setSelectedFile(null);
                          setOpen(true);
                          setEditingId(director._id);
                        }}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(director._id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                        title="Delete"
                      >
                        🗑️
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Update Director' : 'Add New Director'}
            </h2>
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
  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
  <ReactQuill
    theme="snow"
    value={formData.bio}
    onChange={(value) => setFormData({ ...formData, bio: value })}
    className="bg-white rounded-md"
    placeholder="Include heading, subheading or description"
    modules={{
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'clean'],
      ],
    }}
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BoardOfDirectorsPage;
