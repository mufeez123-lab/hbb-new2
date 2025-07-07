import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: { url: string; public_id: string }[];
  category: string;
  location: string;
  price?: string;
  amenities?: string[];
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getById(id);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Unable to load project details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-neutral-600">Loading project details...</div>;
  }

  if (error || !project) {
    return <div className="py-20 text-center text-red-600">{error}</div>;
  }

  const imageUrl = project.images?.[0]?.url || '/images/image1.jpg';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="container mx-auto px-4 py-12 mt-20">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image */}
        <div className="w-full h-96">
          <img
            src={imageUrl}
            alt={project.name}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/image1.jpg';
            }}
          />
        </div>

        {/* Description */}
        <div className="p-6">
          <h2 className="text-2xl font-sans text-neutral-800 mb-2">About {project.name}</h2>
          <p className="text-neutral-700 leading-relaxed text-sm sm:text-base mb-6">
            {project.description}
          </p>

          <div className="flex items-center gap-4 border border-neutral-200 p-2 rounded mb-6">
            <div className="text-sm font-semibold text-neutral-600">TYPE: {project.category}</div>
            {project.price && (
              <div className="text-sm font-semibold text-neutral-600">BUA: {project.price} sqft</div>
            )}
          </div>

          {/* Plans Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Plans</h3>
            <div className="w-full h-64 bg-neutral-100 rounded flex items-center justify-center">
              <p className="text-neutral-500">[Slider with Plan Images Here]</p>
            </div>
          </div>

          {/* Amenities Section */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Amenities</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-neutral-700 text-sm list-disc list-inside">
              {project.amenities && project.amenities.length > 0 ? (
                project.amenities.map((item, idx) => (
                  <li key={idx} className="leading-snug">{item}</li>
                ))
              ) : (
                <li className="text-neutral-500 italic">No amenities listed</li>
              )}
            </ul>
          </div>

          <button className="mt-6 px-4 py-2 bg-[#8a731b] text-white rounded hover:bg-[#745e16]">
            Download Brochure
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
