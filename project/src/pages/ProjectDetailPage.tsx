import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { FiPhone } from 'react-icons/fi';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; 
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
  specifications?: {
    title: string;
    description?: string[];
  }[];
}

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

  if (loading) return <div className="py-20 text-center text-neutral-600">Loading project details...</div>;
  if (error || !project) return <div className="py-20 text-center text-red-600">{error}</div>;

  // Ensure updated (newest) images appear last
  const galleryImages = project.images;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="container mx-auto px-4 py-12 mt-20">
      <div className="bg-white shadow-lg overflow-hidden rounded-lg h-full pb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 h-[400px]">
            <Slider dots infinite speed={1000} slidesToShow={1} slidesToScroll={1} autoplay autoplaySpeed={3000} lazyLoad="progressive" className="h-full">
              {galleryImages.map((img, idx) => (
                <img key={idx} src={img.url} alt={`${project.name}-${idx}`} className="object-cover w-full h-[400px]" />
              ))}
            </Slider>
          </div>
          <div className="w-full lg:w-2/5 p-6 space-y-2">
            <h2 className="text-2xl font-serif text-[#8a731b]">{project.name}</h2>
            <p className="text-sm text-neutral-500">{project.location}</p>
            <div className="bg-neutral-100 px-0 py-2 rounded-md flex gap-4 text-xs font-semibold text-neutral-600 mt-2">
              <div>TYPE: {project.category}</div>
              {project.price && <div>BUA: {project.price} sqft</div>}
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-serif text-neutral-800 mb-2">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
                {project.amenities && project.amenities.length > 0 ? (
                  project.amenities.map((item, idx) => (
                    <div key={idx} className="border border-neutral-200 flex flex-col justify-center items-center text-center rounded hover:shadow transition h-24 p-2">
                      {amenityIcons[item] || <div className="text-xl text-gray-400 mb-1">❓</div>}
                      <span className="text-xs text-neutral-700 mt-1 text-center">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 italic col-span-full">No amenities listed</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
             <Link
  to="/contact"
  className="w-full sm:w-3/4 px-4 py-2 bg-[#8a731b] text-white text-sm text-center hover:bg-[#745e16]"
>
  Contact Us
</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white mt-4 p-6 rounded">
        <h3 className="text-2xl font-serif text-[#8a731b] mb-2">About {project.name}</h3>
        <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">{project.description}</p>
      </div>
      {project.specifications && project.specifications.length > 0 && (
        <div className="bg-white mt-6 p-6 rounded">
          <h3 className="text-2xl font-serif text-neutral-800 mb-4">Specifications</h3>
          <div className="divide-y border rounded border-neutral-200 w-3/4">
            {project.specifications.map((spec, index) => (
              <details key={index} className="group p-4 hover:bg-neutral-50 transition duration-300">
                <summary className="cursor-pointer flex justify-between items-center font-medium text-[#8a731b]">
                  {spec.title}
                  <span className="text-black transition-transform group-open:rotate-90 text-xl">▶</span>
                </summary>
                <ul className="list-disc pl-5 pt-2 text-sm text-neutral-700">
                  {(spec.description || []).map((line, idx) => (
                    <li key={idx}>{line.trim()}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      )}
      {galleryImages.length > 0 && (
        <div className="bg-white mt-6 px-6 py-8 rounded">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-2xl font-serif text-neutral-800">Gallery</h3>
            <div className="flex-1 border-t border-neutral-200" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <img key={idx} src={img.url} alt={`gallery-${idx}`} className="w-full h-56 object-cover rounded border border-neutral-200" loading="lazy" />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetailPage;
