import React, { useEffect, useState } from 'react';
import { brandsAPI } from '../../services/api'; // adjust path as needed
import { toast } from 'react-toastify';

interface Brand {
  _id: string;
  name: string;
  logo?: string;
}

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await brandsAPI.admin.getAll();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update: remove brand from UI immediately
    setDeletingIds((prev) => [...prev, id]);
    const originalBrands = [...brands];
    setBrands((prev) => prev.filter((b) => b._id !== id));

    const toastId = toast.loading('Deleting...');
    try {
      await brandsAPI.admin.delete(id);
      toast.update(toastId, {
        render: 'Brand deleted successfully ✅',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Delete failed:', error);
      // Restore the brand if deletion fails
      setBrands(originalBrands);
      toast.update(toastId, {
        render: 'Failed to delete brand ❌',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">Brands</h1>

      {loading ? (
        <p>Loading brands...</p>
      ) : brands.length === 0 ? (
        <p className="text-gray-500">No brands found.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id} className="border-b">
                <td className="p-2 border text-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    'No logo'
                  )}
                </td>
                <td className="p-2 border">{brand.name}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                    disabled={deletingIds.includes(brand._id)}
                  >
                    {deletingIds.includes(brand._id) ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
