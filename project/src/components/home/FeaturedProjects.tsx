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
}

const FeaturedProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // 👉 FRONTEND STATIC DATA
const projects: Project[] = [
  {
    _id: '1',
    name: 'Hindustan Heights',
    description: 'Luxury residential apartments',
    images: [{ url: '/images/image1.jpg', public_id: 'img1' }],
    category: 'Residential',
    status: 'featured',
    location: 'Mangalore',
    client: 'Private',
    price: '1450',
    explore: true,
  },
  {
    _id: '2',
    name: 'Hindustan Plaza',
    description: 'Premium commercial complex',
    images: [{ url: '/images/image2.jpg', public_id: 'img2' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Udupi',
    client: 'Corporate',
    price: '2100',
    explore: true,
  },
  {
    _id: '3',
    name: 'Hindustan Elite',
    description: 'Modern urban villas',
    images: [{ url: '/images/image3.jpg', public_id: 'img3' }],
    category: 'Villa',
    status: 'featured',
    location: 'Bangalore',
    client: 'Luxury Client',
    explore: true,
  },
  {
    _id: '4',
    name: 'Hindustan Residency',
    description: 'Affordable family homes',
    images: [{ url: '/images/image4.jpg', public_id: 'img4' }],
    category: 'Residential',
    status: 'featured',
    location: 'Kasargod',
    client: 'Private',
    price: '1200',
    explore: true,
  },
  {
    _id: '5',
    name: 'Hindustan Square',
    description: 'Retail & office spaces',
    images: [{ url: '/images/image5.jpg', public_id: 'img5' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Mysore',
    client: 'Business Group',
    price: '1800',
    explore: true,
  },
  {
    _id: '6',
    name: 'Hindustan Gardens',
    description: 'Green living residential enclave',
    images: [{ url: '/images/image6.jpg', public_id: 'img6' }],
    category: 'Residential',
    status: 'featured',
    location: 'Shimoga',
    client: 'Private',
    price: '1350',
    explore: true,
  },
  {
    _id: '7',
    name: 'Hindustan Corporate Hub',
    description: 'Grade-A office infrastructure',
    images: [{ url: '/images/image7.jpg', public_id: 'img7' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Bangalore',
    client: 'IT Firm',
    price: '2500',
    explore: true,
  },
  {
    _id: '8',
    name: 'Hindustan Serenity',
    description: 'Premium villas with landscape views',
    images: [{ url: '/images/image8.jpg', public_id: 'img8' }],
    category: 'Villa',
    status: 'featured',
    location: 'Coorg',
    client: 'Luxury Client',
    explore: true,
  },
  {
    _id: '9',
    name: 'Hindustan Towers',
    description: 'High-rise residential landmark',
    images: [{ url: '/images/image9.jpg', public_id: 'img9' }],
    category: 'Residential',
    status: 'featured',
    location: 'Mangalore',
    client: 'Private',
    price: '1650',
    explore: true,
  },
];

  const mainFeatured = projects.filter(p => p.status === 'featured').slice(0, 9);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <motion.h2
            className="text-2xl font-poppins font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            FEATURED PROJECTS
          </motion.h2>

          <motion.div
            className="w-20 h-1 bg-[#8a6c1a] mx-auto mb-3"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {mainFeatured.map((project) => {
            const imageObj = project.images?.[0];
            const imageUrl = imageObj?.url || '/images/image1.jpg';

            const imageContent = (
              <div className="relative h-48 sm:h-52 md:h-60 lg:h-52 overflow-hidden">
                <img
                  src={imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/image1.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#8a731b] text-white text-xs py-1 px-3 rounded capitalize">
                  {project.status}
                </div>
                <div className="absolute top-3 right-3 bg-primary-900 text-white text-xs py-1 px-3 rounded">
                  {project.category}
                </div>
              </div>
            );

            return (
              <div
                key={project._id}
                className="group"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="bg-white rounded-md overflow-hidden shadow-lg hover:shadow-xl border border-gray-700 transition-transform duration-300 hover:-translate-y-2">
                  {project.explore ? (
                    <Link to={`/projects/${project._id}`}>
                      {imageContent}
                    </Link>
                  ) : (
                    imageContent
                  )}

                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-poppins text-primary-800 mb-1">
                      {project.name}
                    </h3>
                    <div className="text-neutral-500 text-sm mb-1">
                      {project.location}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="text-primary-700 font-semibold text-sm">
                        {project.price ? `BUA: ${project.price} sqft` : project.client}
                      </div>

                      {project.explore && (
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-[#8a731b] inline-flex items-center font-medium"
                        >
                          Explore
                          <ArrowRight
                            size={16}
                            className={`ml-1 transition-transform duration-300 ${
                              hoveredProject === project._id ? 'translate-x-1' : ''
                            }`}
                          />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center bg-[#a0841f] hover:bg-[#8a731b] text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded transition-colors duration-300"
          >
            Browse All Projects
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
