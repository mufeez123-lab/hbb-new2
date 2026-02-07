import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: { url: string; public_id: string }[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
  explore?: boolean;
  // Detailed fields used only in Detail Page
  amenities?: string[];
  specifications?: { title: string; description?: string[] }[];
}

const FeaturedProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // 👉 FULL PROJECT DATA (Consolidated)
  const projects: Project[] = [
    {
      _id: '1',
      name: 'Hindustan Heights',
      description: 'Luxury residential apartments designed for modern living.',
      images: [{ url: '/images/image1.jpg', public_id: 'img1' }],
      category: 'Residential',
      status: 'featured',
      location: 'Mangalore',
      client: 'Private',
      price: '1450',
      explore: true,
      amenities: ['Swimming Pool', 'Gym', '24x7 Security'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Solid block masonry'] },
        { title: 'Flooring', description: ['Vitrified tiles in living/dining'] }
      ]
    },
    {
      _id: '2',
      name: 'Hindustan Plaza',
      description: 'Premium commercial complex situated in the heart of the city.',
      images: [{ url: '/images/img1.jpg', public_id: 'img2' }],
      category: 'Commercial',
      status: 'featured',
      location: 'Udupi',
      client: 'Corporate',
      price: '2100',
      explore: true,
      amenities: ['Covered Parking', '24x7 Security'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Glass facade'] }
      ]
    },
    {
      _id: '3',
      name: 'Hindustan Elite',
      description: 'Exclusive luxury villas offering privacy and elegance.',
      images: [{ url: '/images/image3.jpg', public_id: 'img3' }],
      category: 'Villa',
      status: 'featured',
      location: 'Bangalore',
      client: 'Luxury Client',
      price: '3200',
      explore: true,
      amenities: ['Swimming Pool', 'Park Area', 'Gym', 'Children’s Play Area'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Teak wood doors'] }
      ]
    },
    {
      _id: '4',
      name: 'Hindustan Elite',
      description: 'Exclusive luxury villas offering privacy and elegance.',
      images: [{ url: '/images/image3.jpg', public_id: 'img3' }],
      category: 'Villa',
      status: 'featured',
      location: 'Bangalore',
      client: 'Luxury Client',
      price: '3200',
      explore: true,
      amenities: ['Swimming Pool', 'Park Area', 'Gym', 'Children’s Play Area'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Teak wood doors'] }
      ]
    },
    {
      _id: '5',
      name: 'Hindustan Elite',
      description: 'Exclusive luxury villas offering privacy and elegance.',
      images: [{ url: '/images/image3.jpg', public_id: 'img3' }],
      category: 'Villa',
      status: 'featured',
      location: 'Bangalore',
      client: 'Luxury Client',
      price: '3200',
      explore: true,
      amenities: ['Swimming Pool', 'Park Area', 'Gym', 'Children’s Play Area'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Teak wood doors'] }
      ]
    },
     {
      _id: '6',
      name: 'Hindustan Plaza',
      description: 'Premium commercial complex situated in the heart of the city.',
      images: [{ url: '/images/img1.jpg', public_id: 'img2' }],
      category: 'Commercial',
      status: 'featured',
      location: 'Udupi',
      client: 'Corporate',
      price: '2100',
      explore: true,
      amenities: ['Covered Parking', '24x7 Security'],
      specifications: [
        { title: 'Structure', description: ['RCC framed structure', 'Glass facade'] }
      ]
    },
  
  ];

  const mainFeatured = projects.filter(p => p.status === 'featured').slice(0, 9);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10">
          <motion.h2 className="text-2xl font-poppins font-bold uppercase" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            FEATURED PROJECTS
          </motion.h2>
          <motion.div className="w-20 h-1 bg-[#8a6c1a] mx-auto mb-3" initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {mainFeatured.map((project) => (
            <div key={project._id} className="group" onMouseEnter={() => setHoveredProject(project._id)} onMouseLeave={() => setHoveredProject(null)}>
              <div className="bg-white rounded-md overflow-hidden shadow-md  hover:shadow-xl border border-gray-400 transition-all duration-300 hover:-translate-y-2">
                <Link to={`/projects/${project._id}`}>
                  <div className="relative h-48 sm:h-52 md:h-60 overflow-hidden">
                    <img src={project.images[0].url} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-[#8a731b] text-white text-xs py-1 px-3 rounded capitalize font-display">
                      {project.status}
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <h3 className="text-lg font-display text-primary-800 mb-1">{project.name}</h3>
                  <div className="text-neutral-500 font-display text-sm">{project.location}</div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-primary-700 font-display font-semibold text-sm">
                      {project.price ? `BUA: ${project.price} sqft` : project.client}
                    </div>
                    <Link to={`/projects/${project._id}`} className="text-[#8a731b] inline-flex font-display items-center font-medium">
                      Explore <ArrowRight size={16} className={`ml-1 transition-transform ${hoveredProject === project._id ? 'translate-x-1' : ''}`} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;