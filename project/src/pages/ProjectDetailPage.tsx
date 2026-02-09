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
import { Phone,MapPin } from 'lucide-react';

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
  plans?: { url: string; title: string; public_id: string }[]; // Add this line
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
      <div className="bg-white  overflow-hidden h-full pb-8">
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
              <a href="tel:+1234567890" className="border-2 border-[#8b734b] p-3"><Phone  /></a>
              <a href="https://maps.app.goo.gl/FgEr7gvSWAYRBKdi7" target="_blank" className="border-2 border-[#8b734b] p-3"><MapPin /></a>
            </div>
          </div>
        </div>
      </div>
   {/* Gallery */}
        <div>
   <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-display text-gray-800"> Gallery</h2>
      <div className="flex-grow h-px bg-neutral-200"></div>
    </div>
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


         {/* Plans */}
{/* --- NEW PLANS SECTION START --- */}
{project.plans && project.plans.length > 0 && (
  <div className="mt-16">
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-display text-gray-800"> Plans</h2>
      <div className="flex-grow h-px bg-neutral-200"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {project.plans.map((plan) => (
        <div key={plan.public_id} className="group cursor-pointer">
          <div className="relative overflow-hidden  border border-neutral-200 p-4 rounded-xl transition-all duration-500 group-hover:shadow-xl group-hover:border-[#8b734b]/30">
            <img
              src={plan.url}
              alt={plan.title}
              className="w-full aspect-[4/3] object-contain transition-transform duration-700 group-hover:scale-105"
            />
            {/* View Full Screen Overlay Hint */}
            <div className="absolute inset-0  group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className=" px-4 py-2 text-xs uppercase tracking-widest font-semibold shadow-sm">+</span>
            </div>
          </div>
    
        </div>
      ))}
    </div>
  </div>
)}
      {/* ABOUT */}
      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 bg-white ">
          <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-display text-gray-800"> About the Project</h2>
      <div className="flex-grow h-px bg-neutral-200"></div>
    </div>
          <div className='font-poppins' dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>

        <div className="bg-[#fcfcfc] p-8">
          <h3 className="text-xl mb-6 font-display">Specifications</h3>
          {project.specifications?.map((spec, i) => (
            <div key={i}>
              <h4 className="font-bold font-poppins text-[#8a731b]">{spec.title}</h4>
              <ul className='font-poppins'>
                {spec.description?.map((line, j) => (
                  <li key={j}>• {line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
          
   
      </div>
       {/* Gallery Section */}
 
    </motion.div>
  );
};

export default ProjectDetailPage;
