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
  specifications?: string[];
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
  const [formStep, setFormStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    specifications: [] as string[],
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
    selectedFiles.forEach((file) => {
      data.append('images', file);
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'amenities' && key !== 'specifications') data.append(key, value.toString());
    });

    formData.amenities.forEach((item) => data.append('amenities', item));
    data.append('specifications', JSON.stringify(formData.specifications));

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
    setFormStep(1);
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
      specifications: [],
    });
    setSelectedFiles([]);
  };

  const getImageUrl = (img: string | { url: string }) => {
    if (typeof img === 'object' && img.url) return img.url;
    return `https://hbb-new2.onrender.com${img}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-5 ml-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">
              {editingProjectId ? 'Update Project' : 'Add New Project'}
            </h2>

            {formStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 fields */}
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
                  multiple
                  onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                  className="px-3 py-2 border rounded-md col-span-1 md:col-span-3"
                />
              </div>
            )}

            {formStep === 2 && (
              <div className="mt-4">
                <label className="block font-medium mb-2">Specifications</label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => {
                        const updated = [...formData.specifications];
                        updated[index] = e.target.value;
                        setFormData({ ...formData, specifications: updated });
                      }}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder={`Specification ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.specifications.filter((_, i) => i !== index);
                        setFormData({ ...formData, specifications: updated });
                      }}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      ✖
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, specifications: [...formData.specifications, ''] })
                  }
                  className="mt-2 text-sm text-primary-600 hover:underline"
                >
                  + Add Specification
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              {formStep > 1 && (
                <button onClick={() => setFormStep(formStep - 1)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Back
                </button>
              )}
              {formStep < 2 ? (
                <button
                  onClick={() => setFormStep(formStep + 1)}
                  disabled={!formData.name || !formData.status}
                  className="px-4 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Next
                </button>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
