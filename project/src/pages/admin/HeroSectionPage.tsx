import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface HeroImage {
  url: string;
  public_id: string;
}

const HeroSectionPage: React.FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchHeroImages = async () => {
    try {
      const res = await api.get('/');
      setHeroImages(res.data?.images || []);
    } catch (err) {
      console.error('Fetch hero failed:', err);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => formData.append('images', file));

    try {
      setUploading(true);
      const res = await api.post('/admin/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setHeroImages(res.data?.images || []);
      setOpen(false);
      setSelectedFiles(null);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (public_id: string) => {
    try {
      await api.delete(`/admin/hero/${public_id}`);
      setHeroImages((prev) => prev.filter(img => img.public_id !== public_id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 ml-64">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Hero Section</h1>
              <button
                onClick={() => setOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"
              >
                Upload Images
              </button>
            </div>

            {heroImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {heroImages.map((img) => (
                  <div key={img.public_id} className="relative bg-white shadow rounded overflow-hidden">
                    <img
                      src={img.url}
                      alt="Hero"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => handleDelete(img.public_id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hero images uploaded yet.</p>
            )}
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Hero Images</h2>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setSelectedFiles(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFiles || uploading}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFiles && !uploading
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSectionPage;
