import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';

interface Project {
  _id: string;
  name: string;
  category: string;
  location: string;
}

const BrochureAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/admin/projects');
        console.log('✅ API Response:', res.data);

        // Handle response shape
        const data = res.data;
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        } else {
          console.error('❌ Unexpected format:', data);
          setProjects([]); // fallback
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setMessage('Could not load projects ❌');
      }
    };

    fetchProjects();
  }, []);

  const handleFileChange = (projectId: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [projectId]: file }));
  };

  const handleUpload = async (projectId: string) => {
    const file = selectedFiles[projectId];
    if (!file) {
      alert('Please select a PDF');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('projectId', projectId);

    try {
      setUploading(projectId);
      await axios.post('/admin/brochures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Brochure uploaded successfully ✅');
      setSelectedFiles((prev) => ({ ...prev, [projectId]: null }));
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('Upload failed ❌');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-10">
        <h2 className="text-2xl font-bold mb-6">Upload Brochures to Projects</h2>

        {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-white border p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.category} – {project.location}</p>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleFileChange(project._id, e.target.files?.[0] || null)
                  }
                  className="mb-3"
                />

                <button
                  onClick={() => handleUpload(project._id)}
                  disabled={uploading === project._id}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading === project._id ? 'Uploading...' : 'Upload Brochure'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrochureAdmin;
