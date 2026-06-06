import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import { Edit2, Trash2, Plus, X, Layers, FilePlus, LogOut, Check } from 'lucide-react';

const AVAILABLE_AMENITIES = [
  'Swimming Pool', 'Gym', '24x7 Security', 'Park Area', 'Children’s Play Area',
  'Jogging Track', 'Clubhouse', 'Covered Parking', 'CCTV monitoring', 'High-speed Internet',
  'Rainwater Harvesting', 'Solar Lighting'
];

interface SpecificationItem {
  title: string;
  description: string[];
}

interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  explore: boolean;
  location: string;
  client: string;
  price: string;
  amenities: string[];
  images: { url: string; public_id: string }[];
  gallery: { url: string; public_id: string }[];
  plans: { url: string; title: string; public_id: string }[];
  specifications: SpecificationItem[];
}

const UploadProjectPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'manage' | 'create'>('manage');
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Dashboard Management State
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectRecord | null>(null);

  // Form Field States (Shared between Create and Edit modes)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Residential');
  const [status, setStatus] = useState('featured');
  const [explore, setExplore] = useState(true);
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [price, setPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // File References State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);
  const [planFiles, setPlanFiles] = useState<FileList | null>(null);
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([
    { title: 'Structure', description: ['RCC framed structure', 'Solid block masonry'] }
  ]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const plansInputRef = useRef<HTMLInputElement>(null);

  // Load items from database
  const fetchAllProjects = async () => {
    try {
      setGlobalLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // --- SPECIFICATIONS FORM SUB-ENGINES ---
  const handleAddSpecCategory = () => setSpecifications(prev => [...prev, { title: '', description: [''] }]);
  const handleRemoveSpecCategory = (idx: number) => setSpecifications(prev => prev.filter((_, i) => i !== idx));
  const handleSpecCategoryTitleChange = (idx: number, val: string) => {
    setSpecifications(prev => { const u = [...prev]; u[idx].title = val; return u; });
  };
  const handleAddSpecBullet = (cIdx: number) => {
    setSpecifications(prev => { const u = [...prev]; u[cIdx].description.push(''); return u; });
  };
  const handleRemoveSpecBullet = (cIdx: number, bIdx: number) => {
    setSpecifications(prev => { const u = [...prev]; u[cIdx].description = u[cIdx].description.filter((_, i) => i !== bIdx); return u; });
  };
  const handleSpecBulletTextChange = (cIdx: number, bIdx: number, val: string) => {
    setSpecifications(prev => { const u = [...prev]; u[cIdx].description[bIdx] = val; return u; });
  };

  // --- REPOSITORY ACTION TRIGGERS ---
  const initiateEditModal = (proj: ProjectRecord) => {
    setEditingProject(proj);
    setName(proj.name);
    setDescription(proj.description || '');
    setCategory(proj.category);
    setStatus(proj.status || 'featured');
    setExplore(proj.explore);
    setLocation(proj.location || '');
    setClient(proj.client || '');
    setPrice(proj.price || '');
    setSelectedAmenities(proj.amenities || []);
    setSpecifications(proj.specifications && proj.specifications.length > 0 ? proj.specifications : [{ title: 'Structure', description: [''] }]);
    
    // Clear out any staging file references from prior forms
    setCoverFile(null); setGalleryFiles(null); setPlanFiles(null);
  };

  const closeEditModal = () => {
    setEditingProject(null);
    resetFormStates();
  };

  const resetFormStates = () => {
    setName(''); setDescription(''); setLocation(''); setPrice(''); setClient(''); setSelectedAmenities([]);
    setCoverFile(null); setGalleryFiles(null); setPlanFiles(null);
    setSpecifications([{ title: 'Structure', description: ['RCC framed structure', 'Solid block masonry'] }]);
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (plansInputRef.current) plansInputRef.current.value = '';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/786313login');
  };

  const uploadToStorageBucket = async (file: File, folder: string): Promise<{ url: string; public_id: string }> => {
    const fileExtension = file.name.split('.').pop();
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const filePath = `${folder}/${uniqueId}.${fileExtension}`;
    const { error } = await supabase.storage.from('project-assets').upload(filePath, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('project-assets').getPublicUrl(filePath);
    return { url: data.publicUrl, public_id: uniqueId };
  };

  // --- SUBMIT COMPONENT EVENT HANDLER (CREATE & UPDATE) ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Resolve Cover Image
      let finalImages = editingProject ? editingProject.images : [{ url: '/images/placeholder.jpg', public_id: 'default' }];
      if (coverFile) {
        const uploaded = await uploadToStorageBucket(coverFile, 'covers');
        finalImages = [uploaded];
      }

      // 2. Resolve Gallery Packages
      let finalGallery = editingProject ? [...(editingProject.gallery || [])] : [];
      if (galleryFiles) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const uploaded = await uploadToStorageBucket(galleryFiles[i], 'gallery');
          finalGallery.push(uploaded);
        }
      }

      // 3. Resolve Blueprints
      let finalPlans = editingProject ? [...(editingProject.plans || [])] : [];
      if (planFiles) {
        for (let i = 0; i < planFiles.length; i++) {
          const fileObj = planFiles[i];
          const uploaded = await uploadToStorageBucket(fileObj, 'plans');
          const naturalTitle = fileObj.name.substring(0, fileObj.name.lastIndexOf('.')) || fileObj.name;
          finalPlans.push({ ...uploaded, title: naturalTitle });
        }
      }

      // 4. Sanitize Specs Array Object Mapping
      const sanitizedSpecs = specifications
        .map(spec => ({
          title: spec.title.trim(),
          description: spec.description.map(d => d.trim()).filter(d => d !== '')
        }))
        .filter(spec => spec.title !== '' && spec.description.length > 0);

      const databasePayload = {
        name, description, category, status, explore, location, client, price,
        images: finalImages, gallery: finalGallery, plans: finalPlans,
        specifications: sanitizedSpecs, amenities: selectedAmenities
      };

      if (editingProject) {
        // Execute Update Database Call
        const { error } = await supabase.from('projects').update(databasePayload).eq('id', editingProject.id);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Project document modified and saved successfully!' });
        setEditingProject(null);
      } else {
        // Execute Create New Database Call
        const { error } = await supabase.from('projects').insert([databasePayload]);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Fresh listing launched successfully!' });
      }

      resetFormStates();
      fetchAllProjects();
      setActiveTab('manage');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error syncing database.' });
    } finally {
      setLoading(false);
    }
  };

  // --- REMOVE SELECTION TRANSFERS ---
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this project record? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Delete operation failed: ${err.message}`);
    }
  };

  const renderSpecsFormFields = () => (
    <div className="border p-6 rounded-xl bg-neutral-50 space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <label className="text-sm font-bold uppercase text-neutral-700 tracking-wider">Specifications Matrix Builder</label>
        <button type="button" onClick={handleAddSpecCategory} className="text-xs bg-amber-700 text-white font-semibold uppercase px-3 py-1.5 rounded hover:bg-amber-800 transition">
          + Add Section
        </button>
      </div>
      <div className="space-y-6">
        {specifications.map((spec, catIdx) => (
          <div key={catIdx} className="bg-white p-5 rounded-lg border shadow-sm relative">
            <button type="button" onClick={() => handleRemoveSpecCategory(catIdx)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700 uppercase">
              Remove
            </button>
            <div className="max-w-md mb-4">
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Category / Group Component Title</label>
              <input type="text" required placeholder="e.g. Structure" value={spec.title} onChange={e => handleSpecCategoryTitleChange(catIdx, e.target.value)} className="w-full border-b font-semibold text-neutral-800 p-2 text-sm focus:outline-none focus:border-amber-600" />
            </div>
            <div className="space-y-2 pl-4 border-l-2 border-neutral-100">
              {spec.description.map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex items-center gap-2">
                  <input type="text" required placeholder="Bullet details..." value={bullet} onChange={e => handleSpecBulletTextChange(catIdx, bulletIdx, e.target.value)} className="flex-grow border rounded p-2 text-xs focus:outline-none" />
                  {spec.description.length > 1 && (
                    <button type="button" onClick={() => handleRemoveSpecBullet(catIdx, bulletIdx)} className="text-red-500 text-xs px-1">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => handleAddSpecBullet(catIdx)} className="text-[11px] text-amber-700 font-bold uppercase mt-1 block">+ Add Detail Line</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 mt-20 font-poppins min-h-screen">
      {/* HEADER ACTION CONTROL BAR */}
      <div className="border-b pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Project Management </h1>
          <p className="text-sm text-neutral-500 mt-0.5">Maintain, modify, or extend your operational property records layout.</p>
        </div>
        <button type="button" onClick={handleSignOut} className="flex items-center gap-2 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold uppercase tracking-wider px-4 py-2.5 rounded transition border shadow-sm">
          <LogOut size={14} /> Exit Admin Session
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* TABS ACTION STRIP */}
      <div className="flex border-b mb-8 space-x-2 bg-neutral-100 p-1 rounded-lg max-w-md">
        <button onClick={() => { setActiveTab('manage'); closeEditModal(); }} className={`flex items-center justify-center gap-2 flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition ${activeTab === 'manage' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>
          <Layers size={14} /> Added Projects    ({projects.length})
        </button>
        <button onClick={() => { setActiveTab('create'); closeEditModal(); }} className={`flex items-center justify-center gap-2 flex-grow py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition ${activeTab === 'create' ? 'bg-white shadow text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'}`}>
          <FilePlus size={14} /> Add New Project
        </button>
      </div>

      {/* VIEW: MAIN PROJECT COMPONENT REPOSITORY DATA-TABLE GRID */}
      {activeTab === 'manage' && !editingProject && (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {globalLoading ? (
            <div className="py-20 text-center text-sm tracking-widest text-neutral-400">CONNECTING WITH POSTGRES INSTANCE...</div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center text-neutral-500 text-sm">No active listings found in database cluster architecture.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                    <th className="p-4">Cover Thumbnail</th>
                    <th className="p-4">Project Parameters</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status Map</th>
                    <th className="p-4 text-right">System Configuration Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-neutral-700">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4">
                        <img src={proj.images?.[0]?.url || '/images/placeholder.jpg'} alt="" className="w-20 h-14 object-cover rounded border bg-neutral-100" />
                      </td>
                      <td className="p-4 font-semibold text-neutral-900">
                        <div>{proj.name}</div>
                        <div className="text-[11px] font-normal text-neutral-400 font-mono tracking-tight mt-0.5">{proj.id}</div>
                      </td>
                      <td className="p-4 text-neutral-500">{proj.location || '—'}</td>
                      <td className="p-4 text-xs font-semibold uppercase text-neutral-600">{proj.category}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${proj.status === 'featured' ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>
                          {proj.status || 'normal'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button onClick={() => initiateEditModal(proj)} className="p-2 border rounded hover:bg-neutral-100 transition inline-flex items-center text-neutral-600" title="Edit Properties"><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteProject(proj.id)} className="p-2 border rounded hover:bg-red-50 text-red-500 hover:text-red-700 transition inline-flex items-center" title="Delete Entry"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: CREATE SINGLE COMPONENT MODULE SCHEMAS */}
      {activeTab === 'create' && (
        <form onSubmit={handleFormSubmit} className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-neutral-800 border-b pb-2">Launch New Property Record</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Project Name *</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Description</label>
            <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border bg-white rounded p-3 text-sm text-neutral-700">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Shopping Mall</option>
                <option>Bus Stand</option>
                <option>Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Status Flag</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border bg-white rounded p-3 text-sm text-neutral-700">
                <option>featured</option>
                <option>normal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">BUA Area / Price</label>
              <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 1650" className="w-full border rounded p-3 text-sm"/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Interactive Routing</label>
              <div className="flex items-center h-12">
                <input type="checkbox" id="explore" checked={explore} onChange={e => setExplore(e.target.checked)} className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"/>
                <label htmlFor="explore" className="ml-2 text-sm text-neutral-600">Can Explore Details</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-neutral-50 rounded-lg border border-dashed">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-2">Main Cover Image Asset *</label>
              <input ref={coverInputRef} required type="file" accept="image/*" onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)} className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-2">Client Base Group</label>
              <input type="text" placeholder="Private or Corporate" value={client} onChange={e => setClient(e.target.value)} className="w-full border bg-white rounded p-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-500 mb-3">Select Active Project Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {AVAILABLE_AMENITIES.map(amenity => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button type="button" key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`p-2 text-xs border rounded transition text-left ${isChecked ? 'bg-amber-50 border-amber-600 text-amber-800 font-semibold' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}>
                    {isChecked ? '✓ ' : '+ '} {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Gallery Asset Package</label>
              <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={e => setGalleryFiles(e.target.files)} className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Floor Blueprint Image Assets</label>
              <input ref={plansInputRef} type="file" accept="image/*" multiple onChange={e => setPlanFiles(e.target.files)} className="w-full text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white cursor-pointer" />
            </div>
          </div>

          {renderSpecsFormFields()}

          <button type="submit" disabled={loading} className="w-full py-4 bg-neutral-900 hover:bg-black text-white font-bold tracking-widest text-xs uppercase rounded transition duration-200">
            {loading ? 'Processing & Syncing Records...' : 'Publish Project Document'}
          </button>
        </form>
      )}

      {/* INLINE EDIT MODAL OVERLAY */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-neutral-50 sticky top-0 z-10">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Modify Listing: {editingProject.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Instance Parameter ID: {editingProject.id}</p>
              </div>
              <button onClick={closeEditModal} className="p-2 hover:bg-neutral-200 rounded-full text-neutral-400 hover:text-neutral-700 transition">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Project Name *</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Location</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Description</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded p-3 text-sm focus:outline-none focus:border-amber-600"/>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border bg-white rounded p-3 text-sm text-neutral-700">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Shopping Mall</option>
                    <option>Bus Stand</option>
                    <option>Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Status Flag</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border bg-white rounded p-3 text-sm text-neutral-700">
                    <option>featured</option>
                    <option>normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">BUA Area / Price</label>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded p-3 text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Interactive Routing</label>
                  <div className="flex items-center h-12">
                    <input type="checkbox" id="edit-explore" checked={explore} onChange={e => setExplore(e.target.checked)} className="w-4 h-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"/>
                    <label htmlFor="edit-explore" className="ml-2 text-sm text-neutral-600">Can Explore Details</label>
                  </div>
                </div>
              </div>

              {/* MEDIA MANIFEST EDITS */}
              <div className="bg-neutral-50 p-4 rounded-xl border space-y-4">
                <h4 className="text-xs font-bold uppercase text-neutral-500 border-b pb-1">Media Files Update Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Replace Main Cover File</label>
                    <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files ? e.target.files[0] : null)} className="w-full text-neutral-500" />
                    <p className="text-[10px] text-neutral-400 mt-1">Leave empty to keep your existing active profile cover photo asset.</p>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Inject Extra Gallery Files</label>
                    <input type="file" accept="image/*" multiple onChange={e => setGalleryFiles(e.target.files)} className="w-full text-neutral-500" />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Inject Extra Floor Blueprints</label>
                    <input type="file" accept="image/*" multiple onChange={e => setPlanFiles(e.target.files)} className="w-full text-neutral-500" />
                  </div>
                </div>
              </div>

              {renderSpecsFormFields()}

              <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white z-10 p-2">
                <button type="button" onClick={closeEditModal} className="px-5 py-3 border rounded-lg font-bold text-xs uppercase text-neutral-500 hover:bg-neutral-50 transition">
                  Discard Modifications
                </button>
                <button type="submit" disabled={loading} className="px-6 py-3 bg-neutral-950 hover:bg-black text-white font-bold text-xs uppercase rounded-lg tracking-widest shadow transition inline-flex items-center gap-2">
                  <Check size={14} /> {loading ? 'Saving Changes...' : 'Save '}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProjectPage;