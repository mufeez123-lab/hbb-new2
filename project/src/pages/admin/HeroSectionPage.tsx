import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface HeroImage {
  _id: string;
  backgroundImage: {
    url: string;
    public_id: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const HeroSectionPage: React.FC = () => {
  const [hero, setHero] = useState<HeroImage | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get('/hero')
      .then((res) => setHero(res.data))
      .catch((err) => console.error('Fetch hero failed:', err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('backgroundImage', selectedFile);

    try {
      setUploading(true);
      const res = await api.put('/admin/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHero(res.data);
      setOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 ml-64">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Hero Section</h1>
              <button
                onClick={() => setOpen(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"
              >
                {hero ? 'Update Hero Image' : 'Add Hero Image'}
              </button>
            </div>

            {hero && hero.backgroundImage?.url ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={hero.backgroundImage.url}
                  alt="Hero"
                  className="w-full h-96 object-cover"
                />
              </div>
            ) : (
              <p className="text-gray-500">No hero image uploaded yet.</p>
            )}
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Hero Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || uploading}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFile && !uploading
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {uploading ? 'Uploading...' : hero ? 'Update Image' : 'Add Image'}
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
