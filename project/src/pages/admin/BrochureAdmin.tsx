import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Project {
  _id: string;
  name: string;
  category: string;
  location: string;
}

const BrochureAdmin: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch project details from /admin/projects/:id
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/admin/projects/${projectId}`);
        setProject(res.data.project || res.data); // Adjust if backend sends { project: { ... } }
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setMessage('Project not found ❌');
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!pdf) {
      setMessage('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdf);
    formData.append('projectId', projectId || '');

    try {
      setUploading(true);
      setMessage('');
       await axios.post('/brochures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Brochure uploaded successfully ✅');
      setPdf(null);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed ❌');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4">Upload Brochure</h2>

      {project ? (
        <div className="mb-4">
          <p><strong>Project:</strong> {project.name}</p>
          <p><strong>Category:</strong> {project.category}</p>
          <p><strong>Location:</strong> {project.location}</p>
        </div>
      ) : (
        <p className="text-red-600">{message || 'Loading project details...'}</p>
      )}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !project}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Brochure'}
      </button>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default BrochureAdmin;
