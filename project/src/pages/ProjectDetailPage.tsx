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
  MdOutlineWaves,
  MdOutlineStorefront
} from "react-icons/md";
import { BiSolidCctv, BiHomeSmile } from "react-icons/bi";
import { Phone } from 'lucide-react';

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
  // 👉 Added gallery for internal fetching
  gallery?: { url: string; public_id: string }[];
}

// --- STATIC DATA (Consolidated with Gallery) ---
const projectsData: Project[] = [
  {
    _id: '1',
    name: 'Hindustan Heights',
    description: 'Luxury residential apartments designed for modern living.',
    images: [{ url: '/images/image1.jpg', public_id: 'p1' }],
    category: 'Residential',
    status: 'ongoing',
    location: 'Mangalore',
    client: 'Private',
    price: '1450',
    amenities: ['Swimming Pool', 'Gym', '24x7 Security'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Solid block masonry'] },
        { title: 'Flooring', description: ['Vitrified tiles in living/dining', 'Ceramic tiles in balconies'] }
    ],
    gallery: [
        { url: '/images/image1.jpg', public_id: 'g1-1' },
        { url: '/images/image2.jpg', public_id: 'g1-2' },
        { url: '/images/image3.jpg', public_id: 'g1-3' },
    ]
  },
  {
    _id: '2',
    name: 'Hindustan Plaza',
    description: 'This premium commercial complex stands as a testament to architectural excellence and strategic urban planning. Situated at the epicenter of the citys bustling business district, it offers an unparalleled environment where innovation meets luxury. The building’s sleek, contemporary facade is matched by its state-of-the-art interior, designed to provide high-growth enterprises and established global brands with a workspace that inspires productivity and prestige',
    images: [{ url: '/images/image1.jpg', public_id: 'p2' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Udupi',
    client: 'Corporate',
    price: '2100',
    amenities: ['Covered Parking', '24x7 Security'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Glass facade'] },
        { title: 'Power', description: ['100% DG Backup', 'High speed elevators'] }
    ],
    gallery: [
        { url: '/images/image3.jpg', public_id: 'g2-1' },
        { url: '/images/img1.jpg', public_id: 'g2-2' },
    ]
  },
  {
    _id: '3',
    name: 'Hindustan Elite Villas',
    description: 'Exclusive luxury villas offering privacy and elegance.',
    images: [{ url: '/images/image3.jpg', public_id: 'p3' }],
    category: 'Villa',
    status: 'featured',
    location: 'Bangalore',
    client: 'Luxury Client',
    price: '3200',
    amenities: ['Swimming Pool', 'Park Area', 'Gym', 'Children’s Play Area'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Teak wood doors'] },
        { title: 'Flooring', description: ['Italian Marble', 'Wooden flooring in master bedroom'] }
    ],
    gallery: [
        { url: '/images/image3.jpg', public_id: 'g3-1' },
        { url: '/images/image5.jpg', public_id: 'g3-2' },
    ]
  },
  {
    _id: '4',
    name: 'Hindustan Greens',
    description: 'Eco-friendly residential project designed for sustainable living with lush green landscapes.',
    images: [{ url: '/images/image4.jpg', public_id: 'p4' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Mysore',
    client: 'Private',
    price: '1350',
    amenities: ['Rainwater Harvesting', 'Solar Lighting', 'Organic Garden'],
    specifications: [
        { title: 'Eco-Features', description: ['Solar panels for common areas', 'Waste management system'] },
        { title: 'Structure', description: ['RCC framed structure', 'Fly ash brickwork'] }
    ],
    gallery: [
        { url: '/images/image4.jpg', public_id: 'g4-1' },
        { url: '/images/image6.jpg', public_id: 'g4-2' },
    ]
  },
  {
    _id: '5',
    name: 'Hindustan Trade Center',
    description: 'State-of-the-art business and office spaces located in the growing industrial hub.',
    images: [{ url: '/images/image5.jpg', public_id: 'p5' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Hubli',
    client: 'Enterprise',
    price: '1800',
    amenities: ['Conference Hall', 'Cafeteria', 'High-speed Internet'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Double glazed windows'] },
        { title: 'Security', description: ['Biometric access control', 'CCTV monitoring'] }
    ],
    gallery: [
        { url: '/images/image5.jpg', public_id: 'g5-1' },
        { url: '/images/image7.jpg', public_id: 'g5-2' },
    ]
  },
  {
    _id: '6',
    name: 'Hindustan Serenity',
    description: 'A peaceful retirement living community with specialized healthcare and recreation facilities.',
    images: [{ url: '/images/image6.jpg', public_id: 'p6' }],
    category: 'Residential',
    status: 'completed',
    location: 'Manipal',
    client: 'Private',
    price: '1250',
    amenities: ['Medical Center', 'Library', 'Yoga Deck', 'Catering Service'],
    specifications: [
        { title: 'Safety', description: ['Anti-skid flooring', 'Grab rails in bathrooms'] },
        { title: 'Structure', description: ['Seismic zone compliant RCC structure'] }
    ],
    gallery: [
        { url: '/images/image6.jpg', public_id: 'g6-1' },
        { url: '/images/image8.jpg', public_id: 'g6-2' },
    ]
  },
  {
    _id: '7',
    name: 'Hindustan Aura',
    description: 'Sleek, modern urban apartments for professionals seeking a vibrant lifestyle.',
    images: [{ url: '/images/image7.jpg', public_id: 'p7' }],
    category: 'Residential',
    status: 'featured',
    location: 'Mangalore',
    client: 'Private',
    price: '1600',
    amenities: ['Rooftop Lounge', 'Automated Parking', 'Smart Home Integration'],
    specifications: [
        { title: 'Flooring', description: ['Imported Vitrified tiles', 'Anti-skid tiles in utility'] },
        { title: 'Doors', description: ['Main door with teak wood frame', 'Quality hardware'] }
    ],
    gallery: [
        { url: '/images/image7.jpg', public_id: 'g7-1' },
        { url: '/images/image9.jpg', public_id: 'g7-2' },
    ]
  },
  {
    _id: '8',
    name: 'Hindustan Corporate Park',
    description: 'Expansive IT and corporate hub designed to support global technology firms.',
    images: [{ url: '/images/image8.jpg', public_id: 'p8' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Bangalore',
    client: 'IT Firms',
    price: '2400',
    amenities: ['Centralized AC', 'Data Center Space', 'Amphitheater'],
    specifications: [
        { title: 'Power', description: ['Dual source power supply', '24/7 UPS backup'] },
        { title: 'Lifts', description: ['10 Destination-controlled elevators'] }
    ],
    gallery: [
        { url: '/images/image8.jpg', public_id: 'g8-1' },
        { url: '/images/image10.jpg', public_id: 'g8-2' },
    ]
  },
  {
    _id: '9',
    name: 'Hindustan Grand Avenue',
    description: 'An iconic mixed-use development featuring retail showrooms and luxury workspaces.',
    images: [{ url: '/images/image9.jpg', public_id: 'p9' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Chennai',
    client: 'Corporate',
    price: '2800',
    amenities: ['Grand Lobby', 'Valet Parking', 'Executive Lounge'],
    specifications: [
        { title: 'Facade', description: ['Structural glazing', 'Aluminium composite panels'] },
        { title: 'HVAC', description: ['VRV air conditioning system'] }
    ],
    gallery: [
        { url: '/images/image9.jpg', public_id: 'g9-1' },
        { url: '/images/image11.jpg', public_id: 'g9-2' },
    ]
  },
  {
    _id: '10',
    name: 'Hindustan Palm Retreat',
    description: 'Beach-side luxury villas offering an unmatched vacation lifestyle.',
    images: [{ url: '/images/image10.jpg', public_id: 'p10' }],
    category: 'Villa',
    status: 'completed',
    location: 'Goa',
    client: 'Luxury Client',
    price: '4500',
    amenities: ['Private Beach Access', 'Infinity Pool', 'In-house Chef Service'],
    specifications: [
        { title: 'Structure', description: ['Laterite stone masonry', 'RCC slab'] },
        { title: 'Finishes', description: ['Natural stone cladding', 'Weather-proof exterior paint'] }
    ],
    gallery: [
        { url: '/images/image10.jpg', public_id: 'g10-1' },
        { url: '/images/image12.jpg', public_id: 'g10-2' },
    ]
  },
  {
    _id: '11',
    name: 'Hindustan Lake View',
    description: 'Serene apartments with panoramic views of the water and surrounding hills.',
    images: [{ url: '/images/image11.jpg', public_id: 'p11' }],
    category: 'Residential',
    status: 'ongoing',
    location: 'Udupi',
    client: 'Private',
    price: '1700',
    amenities: ['Jogging Track', 'Viewing Deck', 'Clubhouse'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Solid cement blocks'] },
        { title: 'Windows', description: ['UPVC sliding windows with mosquito mesh'] }
    ],
    gallery: [
        { url: '/images/image11.jpg', public_id: 'g11-1' },
        { url: '/images/image13.jpg', public_id: 'g11-2' },
    ]
  },
  {
    _id: '12',
    name: 'Hindustan Sky Towers',
    description: 'Ultra-luxury high-rise residences that redefine the city skyline.',
    images: [{ url: '/images/image12.jpg', public_id: 'p12' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Bangalore',
    client: 'Private',
    price: '3500',
    amenities: ['Helipad', 'Temperature Controlled Pool', 'Steam & Sauna'],
    specifications: [
        { title: 'Automation', description: ['Full home automation system'] },
        { title: 'Flooring', description: ['Premium Italian Marble'] }
    ],
    gallery: [
        { url: '/images/image12.jpg', public_id: 'g12-1' },
        { url: '/images/image14.jpg', public_id: 'g12-2' },
    ]
  },
  {
    _id: '13',
    name: 'Hindustan Business Bay',
    description: 'A bustling commercial hub with flexible retail and office configurations.',
    images: [{ url: '/images/image13.jpg', public_id: 'p13' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Kochi',
    client: 'Enterprise',
    price: '1950',
    amenities: ['Food Court', 'Fire Safety System', 'Multilevel Parking'],
    specifications: [
        { title: 'Structure', description: ['Post-tensioned slabs for flexible layouts'] },
        { title: 'Lifts', description: ['High-speed passenger and service lifts'] }
    ],
    gallery: [
        { url: '/images/image13.jpg', public_id: 'g13-1' },
        { url: '/images/image15.jpg', public_id: 'g13-2' },
    ]
  },
  {
    _id: '14',
    name: 'Hindustan Heritage Villas',
    description: 'Boutique villas blending traditional architecture with modern amenities.',
    images: [{ url: '/images/image14.jpg', public_id: 'p14' }],
    category: 'Villa',
    status: 'ongoing',
    location: 'Mysore',
    client: 'Luxury Client',
    price: '3800',
    amenities: ['Traditional Courtyard', 'Spa', 'Organic Kitchen Garden'],
    specifications: [
        { title: 'Woodwork', description: ['Handcrafted teak wood pillars'] },
        { title: 'Roofing', description: ['Mangalore tiles with insulation'] }
    ],
    gallery: [
        { url: '/images/image14.jpg', public_id: 'g14-1' },
        { url: '/images/image1.jpg', public_id: 'g14-2' },
    ]
  },
  {
    _id: '15',
    name: 'Hindustan Central Square',
    description: 'An integrated lifestyle destination for shopping, dining, and business.',
    images: [{ url: '/images/image15.jpg', public_id: 'p15' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Hyderabad',
    client: 'Corporate',
    price: '2600',
    amenities: ['Central Atrium', 'Cinema Multiplex', 'Smart Lighting'],
    specifications: [
        { title: 'Structure', description: ['Steel-concrete composite structure'] },
        { title: 'Security', description: ['Integrated building management system'] }
    ],
    gallery: [
        { url: '/images/image15.jpg', public_id: 'g15-1' },
        { url: '/images/image2.jpg', public_id: 'g15-2' },
    ]
  }
];

const amenityIcons: { [key: string]: JSX.Element } = {
  // Residential & Basic
  'Swimming Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'Gym': <FaDumbbell className="text-2xl text-black" />,
  '24x7 Security': <FaShieldAlt className="text-2xl text-black" />,
  'Park Area': <FaTree className="text-2xl text-black" />,
  'Children’s Play Area': <FaChild className="text-2xl text-black" />,
  'Jogging Track': <MdOutlineNaturePeople className="text-2xl text-black" />,
  'Clubhouse': <BiHomeSmile className="text-2xl text-black" />,
  'Viewing Deck': <MdOutlineWaves className="text-2xl text-black" />,
  
  // Commercial & Office
  'Covered Parking': <FaCar className="text-2xl text-black" />,
  'Conference Hall': <MdOutlineMeetingRoom className="text-2xl text-black" />,
  'Cafeteria': <FaUtensils className="text-2xl text-black" />,
  'High-speed Internet': <FaWifi className="text-2xl text-black" />,
  'Business Center': <FaBuilding className="text-2xl text-black" />,
  'CCTV monitoring': <BiSolidCctv className="text-2xl text-black" />,
  '100% DG Backup': <FaCogs className="text-2xl text-black" />,
  'Valet Parking': <FaParking className="text-2xl text-black" />,
  'Food Court': <FaUtensils className="text-2xl text-black" />,
  'Fire Safety System': <FaFireExtinguisher className="text-2xl text-black" />,
  'Multilevel Parking': <FaCar className="text-2xl text-black" />,
  'Central Atrium': <FaBuilding className="text-2xl text-black" />,
  'Cinema Multiplex': <MdOutlineMovieFilter className="text-2xl text-black" />,
  'Smart Lighting': <FaSolarPanel className="text-2xl text-black" />,
  
  // Luxury & Villas
  'Private Beach Access': <MdOutlineNaturePeople className="text-2xl text-black" />,
  'Infinity Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'In-house Chef Service': <FaUtensils className="text-2xl text-black" />,
  'Traditional Courtyard': <BiHomeSmile className="text-2xl text-black" />,
  'Spa': <MdOutlineSelfImprovement className="text-2xl text-black" />,
  'Organic Kitchen Garden': <FaLeaf className="text-2xl text-black" />,
  'Helipad': <FaPlane className="text-2xl text-black" />,
  'Steam & Sauna': <MdOutlineSelfImprovement className="text-2xl text-black" />,
  
  // Eco-Friendly & Retirement
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
  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500" onClick={props.onClick}>›</div>
);

const PrevArrow = (props: any) => (
  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500" onClick={props.onClick}>‹</div>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);



 useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300)); 
        const data = projectsData.find(p => p._id === id);
        if (data) { setProject(data); } 
        else { setError('Project not found.'); }
      } catch (err) { setError('Unable to load project details.'); } 
      finally { setLoading(false); }
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-neutral-600">Loading project details...</div>;
  if (error || !project) return <div className="py-20 text-center text-red-600">{error}</div>;

  const allImages = [...(project.images || []), ...(project.gallery || [])];

  return (
   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container max-w-[130vh] mx-auto py-12 mt-20 px-4">
      
      {/* 1. HERO SECTION WITH GLASSMORPHISM AMENITIES */}
      <div className="bg-white border-b overflow-hidden h-full pb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 h-[450px] relative shadow-lg">
            <Slider infinite speed={1000} slidesToShow={1} slidesToScroll={1} autoplay className="h-full" nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
              {allImages.map((img, idx) => (
                <img key={idx} src={img.url} alt={`${project.name}`} className="object-cover w-full h-[450px]" />
              ))}
            </Slider>
          </div>
          
          <div className="w-full lg:w-2/5 p-8 space-y-4">
            <img src="/logo-SVG.svg" alt="Logo" className="h-10 mb-4" />
            <h2 className="text-3xl font-display text-[#8a731b] tracking-tight">{project.name}</h2>
            <p className="text-sm font-poppins text-neutral-500 uppercase tracking-widest">{project.location}</p>
            
            <div className="bg-neutral-50 font-poppins backdrop-blur-sm border border-neutral-100 px-2 py-3 flex gap-6 text-xs font-semibold text-neutral-600 rounded-sm">
              <div>TYPE: <span className="text-black">{project.category}</span></div>
              {project.price && <div>BUA: <span className="text-black">{project.price} sqft</span></div>}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-serif text-neutral-800 mb-4 border-l-4 border-[#8a731b] pl-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {project.amenities?.map((item, idx) => (
                  <div key={idx} className="bg-white/50 border border-neutral-100 flex items-center gap-3 p-3 rounded-md hover:shadow-sm transition-all group">
                    <div className="group-hover:scale-110 transition-transform">{amenityIcons[item]}</div>
                    <span className="text-xs text-neutral-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex mt-8 gap-3 h-[55px]">
              <Link to="/contact" className="flex-grow flex items-center font-poppins justify-center bg-[#8b734b] text-white font-medium hover:bg-[#76613f] transition-all transform hover:-translate-y-1">
                Download Brochure
              </Link> 
              <a href="tel:+1234567890" className="w-[70px] flex items-center justify-center border-2 border-[#8b734b] text-[#8b734b] hover:bg-neutral-50 transition-all">
                <Phone size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ENHANCED ABOUT SECTION */}
      <div className="grid lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
          <h3 className="text-2xl font-serif text-neutral-800 mb-6">About the Project</h3>
          <div 
            className="text-justify text-neutral-700 font-poppins leading-relaxed text-md space-y-4"
            dangerouslySetInnerHTML={{ __html: project.description }} 
          />
        </div>

        {/* 3. GRID-BASED SPECIFICATIONS */}
        <div className="bg-[#fcfcfc] p-8 rounded-xl border border-neutral-100">
          <h3 className="text-xl font-serif text-neutral-800 mb-6">Specifications</h3>
          <div className="space-y-4">
            {project.specifications?.map((spec, index) => (
              <div key={index} className="pb-4 border-b border-neutral-200 last:border-0">
                <h4 className="font-display font-bold text-[#8a731b] text-sm uppercase mb-2">{spec.title}</h4>
                <ul className="space-y-1">
                  {spec.description?.map((line, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                      <span className="text-[#8a731b]">•</span> {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FLOATING MOBILE ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-neutral-200 p-4 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
        <Link to="/contact" className="flex-1 bg-[#8b734b] text-white py-3 rounded-lg text-center font-bold shadow-lg">
          Get Details
        </Link>
        <a href="tel:+1234567890" className="bg-white border-2 border-[#8b734b] text-[#8b734b] p-3 rounded-lg">
          <Phone size={24} />
        </a>
      </div>

      {/* GALLERY (Simplified Grid) */}
      <div className="mt-12">
        <h3 className="text-2xl font-serif text-neutral-800 mb-6"> Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allImages.slice(0, 8).map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg cursor-pointer" onClick={() => setSelectedImageIndex(idx)}>
              <img src={img.url} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (Keep existing logic) */}
    </motion.div>
  );
};

export default ProjectDetailPage;