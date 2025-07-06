import { useEffect, useState } from 'react';
import { brandsAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';

interface Brand {
  _id: string;
  images: (string | { url: string })[];
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Normalize image URL (Cloudinary or fallback)
  const getImageUrl = (img: string | { url: string }) => {
    if (typeof img === 'string') return img;
    return img?.url || '/default-avatar.png';
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('images', file));

    setLoading(true);
    try {
      await brandsAPI.admin.create(formData); // Backend will handle multiple Cloudinary uploads
      setSelectedFiles([]);
      await fetchBrands();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Upload Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
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

        {/* Brand Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white border p-4 shadow rounded flex flex-col items-center justify-between"
            >
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {brand.images.map((img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={`Brand ${index}`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                ))}
              </div>
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
