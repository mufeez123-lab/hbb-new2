import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import { projectsAPI } from '../services/api'; // Removed API import
import Slider from 'react-slick';
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
  // specific fields from your other pages
  status?: string;
  client?: string;
}

// --- STATIC DATA (Merged from your FeaturedProjects) ---
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
    ]
  },
  {
    _id: '2',
    name: 'Hindustan Plaza',
    description: 'Premium commercial complex situated in the heart of the city.',
    images: [{ url: '/images/image2.jpg', public_id: 'p2' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Udupi',
    client: 'Corporate',
    price: '2100',
    amenities: ['Covered Parking', '24x7 Security'],
    specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Glass facade'] },
        { title: 'Power', description: ['100% DG Backup', 'High speed elevators'] }
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
    ]
  },
  {
    _id: '4',
    name: 'Hindustan Greens',
    description: 'Eco-friendly residential project surrounded by nature.',
    images: [{ url: '/images/image4.jpg', public_id: 'p4' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Mysore',
    client: 'Private',
    amenities: ['Park Area', 'Children’s Play Area'],
  },
  {
    _id: '5',
    name: 'Hindustan Trade Center',
    description: 'State-of-the-art business and office spaces.',
    images: [{ url: '/images/image5.jpg', public_id: 'p5' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Hubli',
    client: 'Enterprise',
    price: '1800',
    amenities: ['Covered Parking', '24x7 Security'],
  },
  {
    _id: '6',
    name: 'Hindustan Serenity',
    description: 'Premium retirement living with peaceful surroundings.',
    images: [{ url: '/images/image6.jpg', public_id: 'p6' }],
    category: 'Residential',
    status: 'completed',
    location: 'Manipal',
    client: 'Private',
    price: '1250',
    amenities: ['Park Area', '24x7 Security', 'Gym'],
  },
  {
    _id: '7',
    name: 'Hindustan Aura',
    description: 'Modern urban apartments with smart home features.',
    images: [{ url: '/images/image7.jpg', public_id: 'p7' }],
    category: 'Residential',
    status: 'featured',
    location: 'Mangalore',
    client: 'Private',
    price: '1600',
    amenities: ['Swimming Pool', 'Gym', 'Covered Parking'],
  },
  {
    _id: '8',
    name: 'Hindustan Corporate Park',
    description: 'IT & corporate office hub designed for productivity.',
    images: [{ url: '/images/image8.jpg', public_id: 'p8' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Bangalore',
    client: 'IT Firms',
    price: '2400',
    amenities: ['Covered Parking', '24x7 Security', 'Gym'],
  },
  {
    _id: '9',
    name: 'Hindustan Grand Avenue',
    description: 'High-end mixed-use development combining retail and living.',
    images: [{ url: '/images/image9.jpg', public_id: 'p9' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Chennai',
    client: 'Corporate',
    price: '2800',
    amenities: ['Swimming Pool', 'Covered Parking'],
  },
  {
    _id: '10',
    name: 'Hindustan Palm Retreat',
    description: 'Luxury villas with private gardens and pools.',
    images: [{ url: '/images/image10.jpg', public_id: 'p10' }],
    category: 'Villa',
    status: 'completed',
    location: 'Goa',
    client: 'Luxury Client',
    price: '4500',
    amenities: ['Swimming Pool', 'Park Area', '24x7 Security'],
  },
  {
    _id: '11',
    name: 'Hindustan Lake View',
    description: 'Apartments overlooking a scenic lake.',
    images: [{ url: '/images/image11.jpg', public_id: 'p11' }],
    category: 'Residential',
    status: 'ongoing',
    location: 'Udupi',
    client: 'Private',
    price: '1700',
    amenities: ['Park Area', 'Children’s Play Area'],
  },
  {
    _id: '12',
    name: 'Hindustan Sky Towers',
    description: 'High-rise luxury residences with skyline views.',
    images: [{ url: '/images/image12.jpg', public_id: 'p12' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Bangalore',
    client: 'Private',
    amenities: ['Swimming Pool', 'Gym', 'Covered Parking', '24x7 Security'],
  },
  {
    _id: '13',
    name: 'Hindustan Business Bay',
    description: 'Retail & office commercial hub.',
    images: [{ url: '/images/image13.jpg', public_id: 'p13' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Kochi',
    client: 'Enterprise',
    price: '1950',
    amenities: ['Covered Parking', '24x7 Security'],
  },
  {
    _id: '14',
    name: 'Hindustan Heritage Villas',
    description: 'Premium villas inspired by heritage design architecture.',
    images: [{ url: '/images/image14.jpg', public_id: 'p14' }],
    category: 'Villa',
    status: 'ongoing',
    location: 'Mysore',
    client: 'Luxury Client',
    price: '3800',
    amenities: ['Swimming Pool', 'Park Area', 'Children’s Play Area'],
  },
  {
    _id: '15',
    name: 'Hindustan Central Square',
    description: 'Integrated commercial & retail destination.',
    images: [{ url: '/images/image15.jpg', public_id: 'p15' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Hyderabad',
    client: 'Corporate',
    price: '2600',
    amenities: ['Covered Parking', '24x7 Security'],
  },
];
// ---------------------------------------------------

const amenityIcons: { [key: string]: JSX.Element } = {
  'Swimming Pool': <FaSwimmingPool className="text-2xl text-black" />,
  'Covered Parking': <FaCar className="text-2xl text-black" />,
  "Children’s Play Area": <FaChild className="text-2xl text-black" />,
  '24x7 Security': <FaShieldAlt className="text-2xl text-black" />,
  Gym: <FaDumbbell className="text-2xl text-black" />,
  'Park Area': <FaTree className="text-2xl text-black" />,
};

// Custom slider arrows
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500"
      onClick={onClick}
    >
      ›
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-2 top-1/2 transform -translate-y-1/2 text-4xl text-white cursor-pointer z-10 hover:text-yellow-500"
      onClick={onClick}
    >
      ‹
    </div>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    // UPDATED: Fetch logic now looks up from the local static array
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Simulate network delay if desired, or just set immediately
        await new Promise(resolve => setTimeout(resolve, 300)); 
        
        const data = projectsData.find(p => p._id === id);
        
        if (data) {
            setProject(data);
        } else {
            setError('Project not found.');
        }
      } catch (err) {
        setError('Unable to load project details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (loading)
    return <div className="py-20 text-center text-neutral-600">Loading project details...</div>;
  if (error || !project)
    return <div className="py-20 text-center text-red-600">{error}</div>;

  const galleryImages = project.images;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-12 mt-20"
    >
      <div className="bg-white shadow-lg overflow-hidden h-full pb-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 h-[400px] relative">
            <Slider
              infinite
              speed={1000}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay
              autoplaySpeed={3000}
              lazyLoad="progressive"
              className="h-full"
              nextArrow={<NextArrow />}
              prevArrow={<PrevArrow />}
            >
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${project.name}-${idx}`}
                  className="object-cover w-full h-[400px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/image1.jpg';
                  }}
                />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-0">
                {project.amenities && project.amenities.length > 0 ? (
                  project.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-neutral-200 flex flex-col justify-center items-center text-center hover:shadow transition h-24 p-2"
                    >
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
                className="block w-full sm:w-full px-4 py-2 bg-[#8a731b] text-white text-sm text-center hover:bg-[#745e16]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white mt-6 px-6 py-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-serif text-[#8a731b] mb-4">About {project.name}</h3>
        <div
          className="text-justify text-neutral-700 leading-relaxed text-sm sm:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-black"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />
      </div>

      {/* Specifications */}
      {project.specifications && project.specifications.length > 0 && (
        <div className="bg-white mt-6 p-6 rounded">
          <h3 className="text-2xl font-serif text-neutral-800 mb-4">Specifications</h3>
          <div className="divide-y border rounded border-neutral-200 w-full sm:w-3/4">
            {project.specifications.map((spec, index) => (
              <details
                key={index}
                className="group p-4 hover:bg-neutral-50 transition duration-300"
              >
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

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <div className="bg-white mt-6 px-6 py-8 rounded">
          <div className="w-full sm:w-3/4 ml-0">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-serif text-neutral-800">Gallery</h3>
              <div className="flex-1 border-t border-neutral-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer group"
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img
                    src={img.url}
                    alt={`gallery-${idx}`}
                    className="w-full h-40 object-cover rounded border border-neutral-200 group-hover:opacity-75 transition"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/image1.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-xl bg-opacity-50 p-0">+</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-5xl mx-4">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-2 right-4 text-white text-3xl font-bold hover:text-red-500 z-50"
            >
              ×
            </button>

            {selectedImageIndex > 0 && (
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev !== null ? prev - 1 : null))
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50"
              >
                ‹
              </button>
            )}

            {selectedImageIndex < galleryImages.length - 1 && (
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) => (prev !== null ? prev + 1 : null))
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-4xl z-50"
              >
                ›
              </button>
            )}

            <img
              src={galleryImages[selectedImageIndex].url}
              alt="Enlarged"
              className="w-full max-h-[90vh] object-contain rounded shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/image1.jpg';
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetailPage;