import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { FiPhone } from 'react-icons/fi';
import {
  FaSwimmingPool,
  FaCar,
  FaChild,
  FaShieldAlt,
  FaDumbbell,
  FaTree,
} from 'react-icons/fa';

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

// Icon mapping for amenities
const amenityIcons: { [key: string]: JSX.Element } = {
  'Swimming Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'Covered Parking': <FaCar className="text-2xl text-black" />,
  "Children’s Play Area": <FaChild className="text-2xl text-black" />,
  '24x7 Security': <FaShieldAlt className="text-2xl text-black" />,
  Gym: <FaDumbbell className="text-2xl text-black" />,
  'Park Area': <FaTree className="text-2xl text-black" />,
};

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
      {/* Project Card */}
      <div className="bg-white shadow-lg overflow-hidden rounded-lg h-full pb-8">
  <div className=" flex flex-col lg:flex h-auto">

          {/* Project Image */}
          <div className="w-full lg:w-3/5 h-[400px] ">
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

          {/* Project Info */}
          <div className="w-full lg:w-2/5 p-6 space-y-2">
            <h2 className="text-2xl font-serif text-[#8a731b]">{project.name}</h2>
            <p className="text-sm text-neutral-500">{project.location}</p>

           <div className="bg-neutral-100 px-0 py-2 rounded-md flex gap-4 text-xs font-semibold text-neutral-600 mt-2">
  <div>TYPE: {project.category}</div>
  {project.price && <div>BUA: {project.price} sqft</div>}
</div>


            {/* Amenities */}
            <div className="mt-4">
              <h3 className="text-xl font-serif text-neutral-800 mb-2">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
                {project.amenities && project.amenities.length > 0 ? (
                  project.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-neutral-200 flex flex-col justify-center items-center text-center rounded hover:shadow transition h-24 p-2"
                    >
                      {amenityIcons[item] || (
                        <div className="text-xl text-gray-400 mb-1">❓</div>
                      )}
                      <span className="text-xs text-neutral-700 mt-1 text-center">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 italic col-span-full">No amenities listed</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button className="w-full sm:w-3/4 px-4 py-2 bg-[#8a731b] text-white text-sm hover:bg-[#745e16]">
                Download Brochure
              </button>
              <a
                href="tel:+916362514956"
                className="w-full sm:w-1/4 px-4 py-1 bg-[#8a731b] text-white text-sm flex items-center justify-center gap-2 hover:bg-[#745e16]"
              >
                <FiPhone className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mt-4 p-6 rounded shadow">
        <h3 className="text-2xl font-serif text-[#8a731b] mb-2">About {project.name}</h3>
        <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
