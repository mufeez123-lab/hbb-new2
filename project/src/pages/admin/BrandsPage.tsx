// src/pages/admin/BrandsPage.tsx
import { useEffect, useState } from 'react';
import { brandsAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';

interface Brand {
  _id: string;
  images: string[];
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Get full image URL (support for relative and absolute)
  const getImageUrl = (path: string) => {
    const base = "https://hbb-new2.vercel.app";
    return path.startsWith('http')
      ? path
      : `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  };

  // Fetch all brands from admin API
  const fetchBrands = async () => {
    try {
      const data = await brandsAPI.admin.getAll();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('images', selectedFile);
    setLoading(true);

    try {
      await brandsAPI.admin.create(formData);
      setSelectedFile(null);
      await fetchBrands(); // Refresh brand list
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete brand
  const handleDelete = async (id: string) => {
    try {
      await brandsAPI.admin.delete(id);
      await fetchBrands();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 sm:p-10">
        <h2 className="text-2xl font-bold mb-6">Manage Brands</h2>

        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="border rounded px-4 py-2"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white border p-4 shadow rounded flex flex-col items-center justify-between"
            >
              <img
                src={getImageUrl(brand.images[0])}
                alt="Brand"
                className="w-24 h-24 object-contain mb-3"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
              <button
                onClick={() => handleDelete(brand._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
