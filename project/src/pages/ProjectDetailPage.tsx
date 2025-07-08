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
        <div className="w-full lg:w-1/2 p-6 space-y-2">
          <h2 className="text-2xl font-serif text-[#8a731b] mb-0">{project.name}</h2>
          <p className="text-sm text-neutral-500">{project.location}</p>

          <div className="flex gap-4 text-sm font-semibold text-neutral-600">
            <div>TYPE: {project.category}</div>
            {project.price && <div>BUA: {project.price} sqft</div>}
          </div>

          <div>
  <h3 className="text-lg font-semibold text-neutral-800 mb-2">Amenities</h3>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
    {project.amenities && project.amenities.length > 0 ? (
      project.amenities.map((item, idx) => (
        <div
          key={idx}
          className="border border-neutral-200 p-4 flex flex-col items-center justify-center text-center rounded hover:shadow transition"
        >
          <img
            src={`/icons/${item.toLowerCase().replace(/\s+/g, '-')}.svg`}
            alt={item}
            className="w-10 h-10 mb-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none'; // Hide image if not found
            }}
          />
          <span className="text-sm text-neutral-700 font-medium">{item}</span>
        </div>
      ))
    ) : (
      <p className="text-neutral-500 italic col-span-full">No amenities listed</p>
    )}
  </div>
</div>

<button className="mt-4 w-1/2 px-4 py-2 bg-[#8a731b] text-white rounded hover:bg-[#745e16]">
  Download Brochure
</button>

        </div>
      </div>
    </div>

    {/* Desc outside the flex box */}
    <div className="bg-white mt-4 p-6 rounded shadow">
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Description</h3>
      <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
        {project.description}
      </p>
    </div>
  </motion.div>
);

};

export default ProjectDetailPage;
