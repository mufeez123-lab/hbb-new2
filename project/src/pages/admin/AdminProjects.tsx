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

    console.log('Submitting form:', { selectedFiles, formData });

    // Append new images only if selected
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => data.append('images', file));
    }

    // Append other fields
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingProjectId ? 'Update Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['name', 'location', 'client', 'price'].map((field) => (
  <input
    key={field}
    type="text"
    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    value={(formData as any)[field]}
    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
    className="px-3 py-2 border rounded-md"
  />
))}

Description Field 
<div className="md:col-span-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
  <ReactQuill
    theme="snow"
    value={formData.description}
    onChange={(value) => setFormData({ ...formData, description: value })}
    className="bg-white rounded-md"
  />
</div>

                <select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="px-3 py-2 border rounded-md">
                  <option value="">Select Category</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Luxury villa">Luxury Villa</option>
                </select>
                <select value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value})} className="px-3 py-2 border rounded-md">
                  <option value="">Select Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="featured">Featured</option>
                  <option value="ready to move">Ready to Move</option>
                  <option value="completed">Completed</option>
                </select>
                <input type="file" accept="image/*" multiple onChange={e=>setSelectedFiles(Array.from(e.target.files||[]))} className="px-3 py-2 border rounded-md w-full" />
              </div>

              {/* Show both existing and new images */}
             {(existingImages.length > 0 || selectedFiles.length > 0) && (
  <div className="mt-4 grid grid-cols-4 gap-2">
    {/* Existing Images with Remove Button */}
    {existingImages.map((img, i) => (
      <div key={`old-${i}`} className="relative w-20 h-20">
        <img
          src={img.url}
          alt={`Existing ${i}`}
          className="w-full h-full object-cover rounded border"
        />
        <button
          type="button"
          onClick={() => {
            const updatedImages = existingImages.filter((_, index) => index !== i);
            setExistingImages(updatedImages);
          }}
          className="absolute top-0 right-0 bg-white text-red-600 border border-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center -translate-y-1/2 translate-x-1/2 shadow"
        >
          ✖
        </button>
      </div>
    ))}

    {/* New Selected Files with Remove Button */}
    {selectedFiles.map((file, i) => (
      <div key={`new-${i}`} className="relative w-20 h-20">
        <img
          src={URL.createObjectURL(file)}
          alt={`New ${i}`}
          className="w-full h-full object-cover rounded border-2 border-primary-600"
        />
        <button
          type="button"
          onClick={() => {
            const updatedFiles = selectedFiles.filter((_, index) => index !== i);
            setSelectedFiles(updatedFiles);
          }}
          className="absolute top-0 right-0 bg-white text-red-600 border border-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center -translate-y-1/2 translate-x-1/2 shadow"
        >
          ✖
        </button>
      </div>
    ))}
  </div>
)}


              {/* Amenities */}
              <div className="mt-4">
                <label className="block font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                  {defaultAmenities.map(amenity=>(
                    <label key={amenity} className={`flex flex-col items-center text-center border rounded p-3 cursor-pointer hover:shadow transition ${formData.amenities.includes(amenity)?'bg-primary-100 border-primary-400':'border-neutral-200'}`}>                    
                      <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={e=>{
                        const updated = e.target.checked?[...formData.amenities,amenity]:formData.amenities.filter(a=>a!==amenity);
                        setFormData({...formData,amenities:updated});
                      }} className="hidden" />
                      {amenityIcons[amenity]||<div className="text-xl mb-1">❓</div>}
                      <span className="text-xs text-neutral-700 mt-2">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-4">
                <label className="block font-medium mb-2">Specifications</label>
                {formData.specifications.map((spec, specIdx)=>(
                  <div key={specIdx} className="bg-gray-50 p-3 rounded-md mb-3 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <input type="text" placeholder="Title" value={spec.title} onChange={e=>{
                        const upd=[...formData.specifications]; upd[specIdx].title=e.target.value; setFormData({...formData,specifications:upd});
                      }} className="px-3 py-2 border rounded-md w-full mr-2" />
                      <button type="button" onClick={()=>{
                        const upd=formData.specifications.filter((_,i)=>i!==specIdx); setFormData({...formData,specifications:upd});
                      }} className="text-red-500 hover:text-red-700 p-2">✖</button>
                    </div>
                    {spec.description.map((desc, descIdx)=>(
                      <div key={descIdx} className="flex items-center mb-2">
                        <input type="text" placeholder={`Description ${descIdx+1}`} value={desc} onChange={e=>{
                          const upd=[...formData.specifications]; upd[specIdx].description[descIdx]=e.target.value; setFormData({...formData,specifications:upd});
                        }} className="px-3 py-2 border rounded-md w-full mr-2" />
                        <button type="button" onClick={()=>{
                          const upd=[...formData.specifications]; upd[specIdx].description = upd[specIdx].description.filter((_,i)=>i!==descIdx); setFormData({...formData,specifications:upd});
                        }} className="text-red-500 hover:text-red-700 p-2">-</button>
                      </div>
                    ))}
                    <button type="button" onClick={()=>{
                      const upd=[...formData.specifications]; upd[specIdx].description.push(''); setFormData({...formData,specifications:upd});
                    }} className="mt-2 text-sm text-primary-600 hover:underline px-2 py-1 border rounded">+ Add Description</button>
                  </div>
                ))}
                <button type="button" onClick={()=>{
                  setFormData({...formData,specifications:[...formData.specifications,{title:'',description:['']}]});
                }} className="mt-2 text-sm text-primary-600 hover:underline px-3 py-2 border rounded-md">+ Add New Specification</button>
              </div>

              {/* Footer */}
              <div className="flex items-center space-x-2 mt-4">
                <input type="checkbox" checked={formData.explore} onChange={e=>setFormData({...formData,explore:e.target.checked})} id="explore" />
                <label htmlFor="explore" className="text-sm">Show on Explore Page</label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button onClick={closeModal} type="button" className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={!formData.name||!formData.status} className={`px-4 py-2 rounded-md text-white ${formData.name&&formData.status?'bg-primary-600 hover:bg-primary-700':'bg-gray-400 cursor-not-allowed'}`}>
                  {editingProjectId?'Update Project':'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;  