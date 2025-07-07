import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { MapPin } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: { url: string; public_id: string }[];
  category: string;
  location: string;
  client: string;
  price?: string;
  completion?: string;
  type?: string;
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
    return (
      <div className="py-20 text-center text-neutral-600">
        Loading project details...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-20 text-center text-red-600">{error}</div>
    );
  }

  const imageUrl = project.images?.[0]?.url || '/images/image1.jpg';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    className="container mx-auto px-6 py-12 sm:py-16 mt-20"

    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold mb-10 text-center">
          {project.name}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Image Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full lg:w-[55%] h-80 md:h-[480px]"
          >
            <img
              src={imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/image1.jpg';
              }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-[45%] p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-3 text-sm sm:text-base text-neutral-600">
              <div className="flex items-center">
                <MapPin className="mr-2 text-secondary-500" size={18} />
                <span>{project.location}</span>
              </div>
              <div><strong>Category:</strong> {project.category}</div>
              {project.type && <div><strong>Type:</strong> {project.type}</div>}
              {project.completion && <div><strong>Completion:</strong> {project.completion}</div>}
              {project.price && <div><strong>Price:</strong>BUA:{project.price}</div>}
              <div><strong>Client:</strong> {project.client}</div>
            </div>

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
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailPage;
