import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Project {
  _id: string;
  name: string;
  location: string;
  brochure?: string;
}

const BrochureAdmin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pdfs, setPdfs] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.projects || [];

      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      toast.error('❌ Failed to load projects');
    }
  };

  const handleFileChange = (projectId: string, file: File | null) => {
    setPdfs((prev) => ({ ...prev, [projectId]: file }));
  };

  const handleUpload = async (projectId: string) => {
    const pdf = pdfs[projectId];
    if (!pdf) return toast.warn('⚠️ Select a brochure file first');

    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('projectId', projectId);

    setLoading((prev) => ({ ...prev, [projectId]: true }));

    try {
      await api.post('/brochures/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Brochure uploaded');
      setPdfs((prev) => ({ ...prev, [projectId]: null }));
      fetchProjects(); // refresh
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('❌ Upload failed');
    } finally {
      setLoading((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  return (
    <div className="flex">
      <ToastContainer position="top-right" />
      <Sidebar />
      <div className="flex-1 p-6 sm:p-10">
        <h2 className="text-2xl font-bold mb-6">Manage Brochures</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">No projects found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border p-4 rounded shadow-sm space-y-3"
              >
                <div className="font-semibold text-lg text-neutral-800">
                  {project.name}
                </div>
                <div className="text-sm text-neutral-600">{project.location}</div>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleFileChange(
                      project._id,
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <button
                  onClick={() => handleUpload(project._id)}
                  disabled={loading[project._id]}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
                >
                  {loading[project._id] ? 'Uploading...' : 'Upload Brochure'}
                </button>

                {project.brochure && (
                  <a
                    href={project.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm mt-2 text-green-600 underline"
                  >
                    View Current Brochure
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrochureAdmin;
