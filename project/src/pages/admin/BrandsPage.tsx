import { useEffect, useState } from 'react';
import { brandsAPI } from '../../services/api';
import Sidebar from '../../components/admin/Sidebar';

interface Brand {
  _id: string;
  image: {
    url: string;
    public_id: string;
  };
}

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    setLoading(true);
    try {
      await brandsAPI.admin.create(formData);
      setSelectedFiles(null);
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

  const getImageUrl = (image: any) => image?.url || '/default-avatar.png';

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
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="border rounded px-4 py-2"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded disabled:opacity-50"
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
              <img
                src={getImageUrl(brand.image)}
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
