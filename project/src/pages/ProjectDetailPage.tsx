import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { supabase } from '../config/supabaseClient';
import {
  FaSwimmingPool, FaCar, FaChild, FaShieldAlt, FaDumbbell, FaTree, 
  FaWifi, FaLeaf, FaSolarPanel, FaClinicMedical, FaBook, FaUtensils, 
  FaBuilding, FaParking, FaPlane, FaCogs, FaTv, FaFireExtinguisher
} from 'react-icons/fa';
import { 
  MdOutlineNaturePeople, MdOutlineMeetingRoom, MdOutlineSelfImprovement, 
  MdOutlineMovieFilter, MdOutlineWaves
} from "react-icons/md";
import { BiSolidCctv, BiHomeSmile } from "react-icons/bi";
import { Phone, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';

import ContactSection from '../components/home/ContactSection';
import { Helmet } from 'react-helmet';

/* ------------------ INTERFACES ------------------ */

interface Project {
  id: string;
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
  plans?: { url: string; title: string; public_id: string }[];
}

/* ------------------ CONFIG & UTILS ------------------ */

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
  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-[#8a731b]" onClick={props.onClick}>›</div>
);

const PrevArrow = (props: any) => (
  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-[#8a731b]" onClick={props.onClick}>‹</div>
);

/* ------------------ MAIN COMPONENT ------------------ */

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Lightbox State
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; index: number; type: 'gallery' | 'plans' }>({
    isOpen: false,
    index: 0,
    type: 'gallery',
  });

  useEffect(() => {
    if (!id) return;

    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setProject(data as Project);
          setError(null);
        } else {
          setError('Project not found.');
        }
      } catch (err: any) {
        console.error("Database query failed:", err);
        setError(err.message || 'Error pulling matching records from cloud.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  // --- LIGHTBOX LOGIC ---
  const openLightbox = (index: number, type: 'gallery' | 'plans') => setLightbox({ isOpen: true, index, type });
  const closeLightbox = () => setLightbox({ ...lightbox, isOpen: false });

  const nextImage = useCallback(() => {
    const list = lightbox.type === 'gallery' ? project?.gallery : project?.plans;
    if (list) setLightbox(prev => ({ ...prev, index: (prev.index + 1) % list.length }));
  }, [lightbox.type, project]);

  const prevImage = useCallback(() => {
    const list = lightbox.type === 'gallery' ? project?.gallery : project?.plans;
    if (list) setLightbox(prev => ({ ...prev, index: (prev.index - 1 + list.length) % list.length }));
  }, [lightbox.type, project]);

  if (loading) return <div className="py-20 text-center text-neutral-600 font-poppins">Loading project details...</div>;
  if (error || !project) return <div className="py-20 text-center text-red-600 font-poppins">{error}</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-[130vh] mx-auto py-12 mt-20 px-4">
      <Helmet>
        <title>{project.name ? `${project.name} | Hindustan Builders` : "Property Details"}</title>
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <div className="bg-white overflow-hidden pb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 h-[450px] relative shadow-lg">
            {project.images && project.images.length > 0 ? (
              <Slider infinite speed={1000} slidesToShow={1} slidesToScroll={1} autoplay nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
                {project.images.map((img, idx) => (
                  <img key={idx} src={img.url} className="object-cover w-full h-[450px]" alt={project.name} />
                ))}
              </Slider>
            ) : (
              <img src="/images/placeholder.jpg" className="object-cover w-full h-[450px]" alt="Placeholder Layout" />
            )}
          </div>

          <div className="w-full lg:w-2/5 p-8 space-y-4">
            <img src="/logo-SVG.svg" className="h-10 mb-4" alt="Logo" />
            <h2 className="text-3xl font-display text-[#8a731b]">{project.name}</h2>
            <div className='flex items-center gap-2'>
              <MapPin size={14} className="text-gray-400" />
              <p className="text-sm uppercase tracking-widest text-neutral-500">{project.location || "N/A"}</p>
            </div>

            <div className="bg-neutral-50 px-2 py-3 flex gap-6 text-xs font-semibold font-poppins text-neutral-600">
              <div>TYPE: <span className="text-black uppercase">{project.category}</span></div>
              {project.price && <div>BUA: <span className="text-black">{project.price} sqft</span></div>}
            </div>

            <div className="grid grid-cols-2 font-poppins gap-2">
              {project.amenities?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-neutral-100 bg-white shadow-sm">
                  {amenityIcons[item] || <FaBuilding className="text-2xl text-black" />}
                  <span className="text-[10px] font-bold uppercase tracking-tight leading-none">{item}</span>
                </div>
              ))}
            </div>

            <div className="hidden lg:flex gap-3 pt-4">
              <Link to="/contact" className="flex-grow bg-[#8b734b] text-white flex items-center justify-center font-bold tracking-widest text-xs uppercase transition-colors hover:bg-[#6e5a3b]">Download Brochure</Link>
              <a href="tel:+1234567890" className="border border-[#8b734b] p-3 text-[#8b734b] hover:bg-[#8b734b] hover:text-white transition-all"><Phone size={20} /></a>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="border border-[#8b734b] p-3 text-[#8b734b] hover:bg-[#8b734b] hover:text-white transition-all"><MapPin size={20} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. GALLERY SECTION */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-display text-gray-800">Gallery</h2>
            <div className="flex-grow h-px bg-neutral-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.gallery.map((img, idx) => (
              <motion.img
                whileHover={{ scale: 1.03 }}
                key={img.public_id || idx}
                src={img.url}
                onClick={() => openLightbox(idx, 'gallery')}
                className="rounded-lg object-cover h-48 w-full cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300"
                alt="Project Gallery Asset"
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. PLANS SECTION */}
      {project.plans && project.plans.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-display text-gray-800">Plans</h2>
            <div className="flex-grow h-px bg-neutral-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.plans.map((plan, idx) => (
              <div key={plan.public_id || idx} className="group cursor-pointer" onClick={() => openLightbox(idx, 'plans')}>
                <div className="relative overflow-hidden border border-neutral-200 p-6 rounded-xl transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#8b734b]/30 bg-[#f9f9f9]">
                  <img src={plan.url} alt={plan.title} className="w-full aspect-[4/3] object-contain transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ABOUT & SPECIFICATIONS */}
      <div className="grid lg:grid-cols-3 gap-12 mt-20">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-display text-gray-800">About the Project</h2>
            <div className="flex-grow h-px bg-neutral-200"></div>
          </div>
          <div className='font-poppins text-gray-700 leading-relaxed text-lg' dangerouslySetInnerHTML={{ __html: project.description || 'No description available.' }} />
        </div>

        {project.specifications && project.specifications.length > 0 && (
          <div className="bg-[#fcfcfc] p-8 border border-neutral-100 rounded-lg">
            <h3 className="text-2xl mb-8 font-display border-b pb-4 text-[#8a731b]">Specifications</h3>
            <div className="space-y-4">
              {project.specifications.map((spec, i) => (
                <div key={i} className="border-b border-neutral-200 last:border-0 pb-4">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="flex w-full items-center justify-between py-2 text-left transition-all duration-300 group"
                  >
                    <h4 className={`font-bold font-poppins uppercase tracking-widest text-xs transition-colors ${openIndex === i ? 'text-[#8a731b]' : 'text-neutral-500 group-hover:text-[#8a731b]'}`}>
                      {spec.title}
                    </h4>
                    <span className={`transform transition-transform duration-300 text-[#8a731b] ${openIndex === i ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronRight size={18} className="rotate-90" />
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="font-poppins text-sm text-neutral-600 space-y-3 pt-3 pl-1">
                          {spec.description?.map((line, j) => (
                            <li key={j} className="flex gap-3">
                              <span className="text-[#8a731b] mt-1">•</span>
                              <span className="leading-snug">{line}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ContactSection />

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <button onClick={closeLightbox} className="absolute top-8 right-8 text-white hover:text-[#8a731b] transition-colors z-[110]">
              <X size={48} strokeWidth={1} />
            </button>

            <button onClick={prevImage} className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-[110]">
              <ChevronLeft size={64} strokeWidth={1} />
            </button>

            <motion.div 
              key={lightbox.index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
            >
              <img
                src={lightbox.type === 'gallery' ? project.gallery?.[lightbox.index]?.url : project.plans?.[lightbox.index]?.url}
                className="max-w-full max-h-[80vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white/5 p-2"
                alt="Enlarged Visual Display"
              />
              <p className="text-white mt-8 font-serif text-2xl tracking-[0.3em] uppercase opacity-80">
                {lightbox.type === 'plans' ? project.plans?.[lightbox.index]?.title : `${lightbox.index + 1} / ${project.gallery?.length}`}
              </p>
            </motion.div>

            <button onClick={nextImage} className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-[110]">
              <ChevronRight size={64} strokeWidth={1} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProjectDetailPage;