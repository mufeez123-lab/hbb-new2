import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import {
  FaSwimmingPool,
  FaCar,
  FaChild,
  FaShieldAlt,
  FaDumbbell,
  FaTree,
  FaWifi,
  FaLeaf,
  FaSolarPanel,
  FaClinicMedical,
  FaBook,
  FaUtensils,
  FaBuilding,
  FaParking,
  FaPlane,
  FaCogs,
  FaTv,
  FaFireExtinguisher
} from 'react-icons/fa';
import { 
  MdOutlineNaturePeople, 
  MdOutlineMeetingRoom, 
  MdOutlineSelfImprovement, 
  MdOutlineMovieFilter,
  MdOutlineWaves
} from "react-icons/md";
import { BiSolidCctv, BiHomeSmile } from "react-icons/bi";
import { Phone } from 'lucide-react';

import { getProjectById } from '../service/ProjectService';
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
  specifications?: {
    title: string;
    description?: string[];
  }[];
  status?: string;
  client?: string;
  gallery?: { url: string; public_id: string }[];
}

const amenityIcons: { [key: string]: JSX.Element } = {
  'Swimming Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'Gym': <FaDumbbell className="text-2xl text-black" />,
  '24x7 Security': <FaShieldAlt className="text-2xl text-black" />,
  'Park Area': <FaTree className="text-2xl text-black" />,
  'Children’s Play Area': <FaChild className="text-2xl text-black" />,
  'Jogging Track': <MdOutlineNaturePeople className="text-2xl text-black" />,
  'Clubhouse': <BiHomeSmile className="text-2xl text-black" />,
  'Viewing Deck': <MdOutlineWaves className="text-2xl text-black" />,
  'Covered Parking': <FaCar className="text-2xl text-black" />,
  'Conference Hall': <MdOutlineMeetingRoom className="text-2xl text-black" />,
  'Cafeteria': <FaUtensils className="text-2xl text-black" />,
  'High-speed Internet': <FaWifi className="text-2xl text-black" />,
  'CCTV monitoring': <BiSolidCctv className="text-2xl text-black" />,
  '100% DG Backup': <FaCogs className="text-2xl text-black" />,
  'Valet Parking': <FaParking className="text-2xl text-black" />,
  'Food Court': <FaUtensils className="text-2xl text-black" />,
  'Fire Safety System': <FaFireExtinguisher className="text-2xl text-black" />,
  'Multilevel Parking': <FaCar className="text-2xl text-black" />,
  'Central Atrium': <FaBuilding className="text-2xl text-black" />,
  'Cinema Multiplex': <MdOutlineMovieFilter className="text-2xl text-black" />,
  'Smart Lighting': <FaSolarPanel className="text-2xl text-black" />,
  'Private Beach Access': <MdOutlineNaturePeople className="text-2xl text-black" />,
  'Infinity Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'In-house Chef Service': <FaUtensils className="text-2xl text-black" />,
  'Traditional Courtyard': <BiHomeSmile className="text-2xl text-black" />,
  'Spa': <MdOutlineSelfImprovement className="text-2xl text-black" />,
  'Organic Kitchen Garden': <FaLeaf className="text-2xl text-black" />,
  'Helipad': <FaPlane className="text-2xl text-black" />,
  'Steam & Sauna': <MdOutlineSelfImprovement className="text-2xl text-black" />,
  'Rainwater Harvesting': <FaLeaf className="text-2xl text-black" />,
  'Solar Lighting': <FaSolarPanel className="text-2xl text-black" />,
  'Organic Garden': <FaLeaf className="text-2xl text-black" />,
  'Medical Center': <FaClinicMedical className="text-2xl text-black" />,
  'Library': <FaBook className="text-2xl text-black" />,
  'Yoga Deck': <MdOutlineSelfImprovement className="text-2xl text-black" />,
  'Catering Service': <FaUtensils className="text-2xl text-black" />,
  'Smart Home Integration': <FaTv className="text-2xl text-black" />,
};

const NextArrow = (props: any) => (
  <div
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500"
    onClick={props.onClick}
  >›</div>
);

const PrevArrow = (props: any) => (
  <div
    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500"
    onClick={props.onClick}
  >‹</div>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const data = getProjectById(id);

    if (data) {
      setProject(data as Project);
      setError(null);
    } else {
      setError('Project not found.');
    }

    setLoading(false);
  }, [id]);

  if (loading) return <div className="py-20 text-center text-neutral-600">Loading project details...</div>;
  if (error || !project) return <div className="py-20 text-center text-red-600">{error}</div>;

  const allImages = [...(project.images || [])];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-[130vh] mx-auto py-12 mt-20 px-4">

      {/* HERO */}
      <div className="bg-white border-b overflow-hidden h-full pb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 h-[450px] relative shadow-lg">
            <Slider infinite speed={1000} slidesToShow={1} slidesToScroll={1} autoplay nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
              {project.images.map((img, idx) => (
                <img key={idx} src={img.url} className="object-cover w-full h-[450px]" />
              ))}
            </Slider>
          </div>

          <div className="w-full lg:w-2/5 p-8 space-y-4">
            <img src="/logo-SVG.svg" className="h-10 mb-4" />
            <h2 className="text-3xl font-display text-[#8a731b]">{project.name}</h2>
            <p className="text-sm uppercase tracking-widest text-neutral-500">{project.location}</p>

            <div className="bg-neutral-50 px-2 py-3 flex gap-6 text-xs font-semibold text-neutral-600">
              <div>TYPE: <span className="text-black">{project.category}</span></div>
              {project.price && <div>BUA: <span className="text-black">{project.price} sqft</span></div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {project.amenities?.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 border">
                  {amenityIcons[item]}
                  <span className="text-xs">{item}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex gap-3">
              <Link to="/contact" className="flex-grow bg-[#8b734b] text-white flex items-center justify-center">Download Brochure</Link>
              <a href="tel:+1234567890" className="border-2 border-[#8b734b] p-3"><Phone /></a>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 bg-white p-8">
          <h3 className="text-2xl mb-6">About the Project</h3>
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>

        <div className="bg-[#fcfcfc] p-8">
          <h3 className="text-xl mb-6">Specifications</h3>
          {project.specifications?.map((spec, i) => (
            <div key={i}>
              <h4 className="font-bold text-[#8a731b]">{spec.title}</h4>
              <ul>
                {spec.description?.map((line, j) => (
                  <li key={j}>• {line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
           {/* Gallery Section */}
   
      </div>
   <div>
        <h2 className="text-xl font-semibold mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.gallery?.map(img => (
            <img
              key={img.public_id}
              src={img.url}
              alt="Gallery"
              className="rounded-lg object-cover h-full w-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
