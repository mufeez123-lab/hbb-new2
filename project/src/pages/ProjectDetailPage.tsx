import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { FiPhone } from 'react-icons/fi'; // 📞 phone icon

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-12 mt-20"
    >
      {/* Card section */}
      <div className="bg-white shadow-lg overflow-hidden rounded-lg">
        <div className="lg:flex">
          {/* Image */}
          <div className="w-full lg:w-3/5 h-64 lg:h-auto aspect-[4/3]">
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
          <div className="w-full lg:w-2/5 p-6 space-y-2">
            <h2 className="text-2xl font-serif text-[#8a731b] mb-0">{project.name}</h2>
            <p className="text-sm text-neutral-500 mb-2">{project.location}</p>

            <div className="flex gap-4 text-sm font-semibold text-neutral-600 mb-2  ">
              <div>TYPE: {project.category}</div>
              {project.price && <div>BUA: {project.price} sqft</div>}
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-2xl font-serif text-neutral-800 mb-2 mt-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-0 mt-4">
                {project.amenities && project.amenities.length > 0 ? (
                  project.amenities.map((item, idx) => (
                    <div
  key={idx}
  className="border border-neutral-200 p-4 flex flex-col justify-between items-center text-center rounded hover:shadow transition h-28"
>
  <img
    src={`/icons/${item.toLowerCase().replace(/\s+/g, '-')}.svg`}
    alt={item}
    className="w-10 h-10"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
    }}
  />
  <span className="text-xs text-neutral-700">{item}</span>
</div>

                  ))
                ) : (
                  <p className="text-neutral-500 italic col-span-full">No amenities listed</p>
                )}
              </div>
            </div>

            {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
  <button className="w-full sm:w-3/4 px-4 py-2 bg-[#8a731b] text-white hover:bg-[#745e16]">
    Download Brochure
  </button>
  <a
    href="tel:+916362514956"
    className="w-full sm:w-1/4 px-4 py-2 bg-[#8a731b] text-white flex items-center justify-center gap-2 hover:bg-green-700"
  >
    <FiPhone className="h-5 w-5" />
    Call Now
  </a>
</div>

          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mt-4 p-6 rounded shadow">
        <h3 className="text-2xl font-semibold text-[#8a731b] mb-2">About {project.name}</h3>
        <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
