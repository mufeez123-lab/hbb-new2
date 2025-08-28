import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';

interface AboutStats {
  _id?: string;
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awardsWon: number;
}

const AboutStatsPage: React.FC = () => {
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<AboutStats, '_id'>>({
    yearsOfExperience: 0,
    completedProjects: 0,
    happyClients: 0,
    awardsWon: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/about');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleClickOpen = () => {
    if (stats) {
      setFormData({
        yearsOfExperience: stats.yearsOfExperience,
        completedProjects: stats.completedProjects,
        happyClients: stats.happyClients,
        awardsWon: stats.awardsWon,
      });
    } else {
      setFormData({
        yearsOfExperience: 0,
        completedProjects: 0,
        happyClients: 0,
        awardsWon: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (stats?._id) {
        await api.put('/admin/about', { ...formData, _id: stats._id });
      } else {
        await api.post('/admin/about', formData);
      }
      fetchStats();
      handleClose();
    } catch (err) {
      console.error('Error saving stats:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 ml-0 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between mb-6">
              <h1 className="text-3xl font-semibold">About Page Stats</h1>
              <button
                onClick={handleClickOpen}
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
              >
                {stats ? 'Edit Stats' : 'Add Stats'}
              </button>
            </div>

            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded p-6">
                  <h2 className="text-lg font-bold mb-2">
                    Experience: {stats.yearsOfExperience} years
                  </h2>
                  <p>Projects: {stats.completedProjects}</p>
                  <p>Clients: {stats.happyClients}</p>
                  <p>Awards: {stats.awardsWon}</p>
                  <div className="mt-4 text-right">
                    <button
                      onClick={handleClickOpen}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {stats ? 'Edit Stats' : 'Add Stats'}
            </h2>

            <form className="space-y-4">
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Completed Projects"
                value={formData.completedProjects}
                onChange={(e) =>
                  setFormData({ ...formData, completedProjects: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Happy Clients"
                value={formData.happyClients}
                onChange={(e) =>
                  setFormData({ ...formData, happyClients: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Awards Won"
                value={formData.awardsWon}
                onChange={(e) =>
                  setFormData({ ...formData, awardsWon: Number(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </form>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {stats ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutStatsPage;
