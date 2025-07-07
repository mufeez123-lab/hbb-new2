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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden lg:flex">
        {/* Image */}
        <div className="w-full lg:w-1/2 h-80 lg:h-auto">
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

        {/* Details */}
        <div className="w-full lg:w-1/2 p-6 space-y-5">
          <h2 className="text-2xl font-sans text-neutral-800 mb-1">{project.name}</h2>
          <p className="text-sm text-neutral-500">{project.location}</p>

          {project.price && (
            <div className="text-lg font-semibold text-[#8a731b] border border-[#f1e4c2] bg-[#f1e4c2] rounded p-2">
             BUA :{project.price} sqft
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Description</h3>
            <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </div>

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

          <button className="mt-4 px-4 py-2 bg-[#8a731b] text-white rounded hover:bg-[#745e16]">
            Download Brochure
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;