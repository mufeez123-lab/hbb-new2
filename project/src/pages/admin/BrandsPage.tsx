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
    setDeletingIds((prev) => [...prev, id]); // Show "Deleting..."

    try {
      await brandsAPI.admin.delete(id);
      toast.success('Brand deleted successfully');
      await fetchBrands();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete brand');
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id)); // Remove from deleting list
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
