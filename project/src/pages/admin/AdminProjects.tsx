import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaSwimmingPool,
  FaCar,
  FaChild,
  FaShieldAlt,
  FaDumbbell,
  FaTree,
} from 'react-icons/fa';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: (string | { url: string })[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
  amenities?: string[];
  explore?: boolean;
}

const defaultAmenities = [
  'Park Area',
  'Gym',
  '24x7 Security',
  'Swimming Pool',
  'Children’s Play Area',
  'Covered Parking',
];

const amenityIcons: { [key: string]: JSX.Element } = {
  'Swimming Pool': <FaSwimmingPool className="text-xl mb-1" />,
  'Covered Parking': <FaCar className="text-xl mb-1" />,
  "Children’s Play Area": <FaChild className="text-xl mb-1" />,
  '24x7 Security': <FaShieldAlt className="text-xl mb-1" />,
  Gym: <FaDumbbell className="text-xl mb-1" />,
  'Park Area': <FaTree className="text-xl mb-1" />,
};

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
    amenities: [] as string[],
    explore: true,
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      toast.error('❌ Failed to load projects');
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (selectedFile) data.append('images', selectedFile);

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'amenities') data.append(key, value.toString());
    });

    formData.amenities.forEach((item) => data.append('amenities', item));

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingProjectId) {
        await api.put(`/admin/projects/${editingProjectId}`, data, config);
        toast.success('✅ Project updated successfully');
      } else {
        await api.post('/admin/projects', data, config);
        toast.success('✅ Project added successfully');
      }

      await fetchProjects();
      closeModal();
    } catch (err) {
      console.error('API Error:', err);
      toast.error('❌ Something went wrong!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('🗑️ Project deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete project');
    }
  };

  const closeModal = () => {
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
      amenities: [],
      explore: true,
    });
    setSelectedFile(null);
  };

  const getImageUrl = (img: string | { url: string }) => {
    if (typeof img === 'object' && img.url) return img.url;
    return `https://hbb-new2.onrender.com${img}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-0 md:mr-10">
          <div className="max-w-10xl mx-auto">
            <div className="flex justify-between items-start mb-4">
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
                    amenities: [],
                    explore: true,
                  });
                  setSelectedFile(null);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
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
                          ? getImageUrl(project.images[0])
                          : '/images/image1.jpg'
                      }
                      alt={project.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{project.name}</h3>
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
                              amenities: project.amenities || [],
                              explore: project.explore ?? true,
                            });
                            setEditingProjectId(project._id);
                            setSelectedFile(null);
                            setOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">
              {editingProjectId ? 'Update Project' : 'Add New Project'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['name', 'description', 'location', 'client', 'price'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field === 'price' ? 'Square Feet' : field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="px-3 py-2 border rounded-md"
                />
              ))}

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Luxury villa">Luxury Villa</option>
              </select>

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Select Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="featured">Featured</option>
                <option value="ready to move">Ready to Move</option>
                <option value="completed">Completed</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="px-3 py-2 border rounded-md col-span-1 md:col-span-3"
              />
            </div>

            <div className="mt-4">
              <label className="block font-medium mb-2">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                {defaultAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex flex-col items-center text-center border border-neutral-200 rounded p-3 cursor-pointer hover:shadow transition"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.amenities, amenity]
                          : formData.amenities.filter((a) => a !== amenity);
                        setFormData({ ...formData, amenities: updated });
                      }}
                      className="hidden"
                    />
                    {amenityIcons[amenity] || <div className="text-xl mb-1">❓</div>}
                    <span className="text-xs text-neutral-700 mt-2">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                checked={formData.explore}
                onChange={(e) => setFormData({ ...formData, explore: e.target.checked })}
                id="explore"
              />
              <label htmlFor="explore" className="text-sm">Show on Explore Page</label>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
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
      )}
    </div>
  );
};

export default AdminProjects;