import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
}

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: '',
    location: '',
    client: '',
    price: '',
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    api.get('/admin/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    const data = new FormData();
    if (selectedFile) {
      data.append('images', selectedFile);
    }
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('status', formData.status);
    data.append('location', formData.location);
    data.append('client', formData.client);
    data.append('price', formData.price);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      };

      if (editingProjectId) {
        await api.put(`/admin/projects/${editingProjectId}`, data, config);
      } else {
        await api.post('/admin/projects', data, config);
      }

      const updated = await api.get('/admin/projects');
      setProjects(updated.data);
      setOpen(false);
      setSelectedFile(null);
      setEditingProjectId(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        status: '',
        location: '',
        client: '',
        price: '',
      });
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-0 md:mr-10">
          <div className="max-w-10xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Projects</h1>
              <button
                onClick={() => {
                  setOpen(true);
                  setEditingProjectId(null);
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    status: '',
                    location: '',
                    client: '',
                    price: '',
                  });
                  setSelectedFile(null);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-40 bg-gray-100">
                    <img
                      src={
                        project.images?.[0]
                          ? `https://hbb-new2.vercel.app${project.images[0]}`
                          : '/images/image1.jpg'
                      }
                      alt={project.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-1">{project.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-gray-500">{project.category}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setFormData({
                              name: project.name,
                              description: project.description,
                              category: project.category,
                              status: project.status,
                              location: project.location,
                              client: project.client,
                              price: project.price || '',
                            });
                            setEditingProjectId(project._id);
                            setSelectedFile(null);
                            setOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
            <h2 className="text-xl font-bold mb-4">
              {editingProjectId ? 'Update Project' : 'Add New Project'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="featured">Featured</option>
                <option value="ready to move">Ready to Move</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setEditingProjectId(null);
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
                      status: '',
                      location: '',
                      client: '',
                      price: '',
                    });
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.status}
                  className={`px-4 py-2 rounded-md text-white ${
                    formData.name && formData.status
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editingProjectId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
