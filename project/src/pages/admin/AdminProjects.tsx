import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  images: { url: string; public_id: string }[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
  amenities?: string[];
  explore?: boolean;
  specifications?: { title: string; description: string[] }[];
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; public_id: string }[]>([]);
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
    specifications: [] as { title: string; description: string[] }[],
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => data.append('images', file));
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'amenities') {
        (value as string[]).forEach(item => data.append(key, item));
      } else if (key === 'specifications') {
        data.append(key, JSON.stringify(value));
      } else if (key === 'explore') {
        data.append(key, value.toString());
      } else {
        data.append(key, value as string);
      }
    });

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
    } catch (err: any) {
      console.error('API Error:', err);
      toast.error(`❌ Something went wrong! ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('🗑️ Project deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete project');
    }
  };

  const closeModal = () => {
    setEditingProjectId(null);
    setFormData({
      name: '', description: '', category: '', status: '', location: '', client: '', price: '', amenities: [], explore: true, specifications: [],
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setOpen(false);
  };

  const startAdd = () => {
    closeModal();
    setOpen(true);
  };

  const startEdit = (project: Project) => {
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
      specifications: project.specifications || [],
    });
    setExistingImages(project.images);
    setSelectedFiles([]);
    setEditingProjectId(project._id);
    setOpen(true);
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
              <button onClick={startAdd} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                Add Project
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(proj => (
                <div key={proj._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-40 bg-gray-100">
                    <img src={proj.images[0] ? getImageUrl(proj.images[0]) : '/images/image1.jpg'} alt={proj.name} className="w-full h-40 object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{proj.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{proj.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-gray-500">{proj.category}</span>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => startEdit(proj)} className="text-blue-600 hover:text-blue-800">✏️</button>
                        <button onClick={() => handleDelete(proj._id)} className="text-red-600 hover:text-red-800">🗑️</button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-start sm:items-center justify-start sm:justify-center p-0 sm:p-4">
          <div className="bg-white rounded-none sm:rounded-lg p-4 sm:p-6 w-full h-full sm:h-auto sm:max-w-2xl overflow-y-auto sm:max-h-[90vh]">
            {/* Insert the same form JSX block you already have here */}
            {/* No changes needed inside the form */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
