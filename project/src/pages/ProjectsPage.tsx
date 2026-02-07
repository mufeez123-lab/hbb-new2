import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

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
  completionDate?: string;
  explore?: boolean;
}

const FeaturedProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // 👉 ALL PROJECTS – FRONTEND DATA
 const projects: Project[] = [
  {
    _id: '1',
    name: 'Hindustan Heights',
    description: 'Luxury residential apartments',
    images: [{ url: '/images/image1.jpg', public_id: 'p1' }],
    category: 'Residential',
    status: 'ongoing',
    location: 'Mangalore',
    client: 'Private',
    price: '1450',
    explore: true,
  },
  {
    _id: '2',
    name: 'Hindustan Plaza',
    description: 'Premium commercial complex',
    images: [{ url: '/images/image2.jpg', public_id: 'p2' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Udupi',
    client: 'Corporate',
    price: '2100',
    explore: true,
  },
  {
    _id: '3',
    name: 'Hindustan Elite Villas',
    description: 'Exclusive luxury villas',
    images: [{ url: '/images/image3.jpg', public_id: 'p3' }],
    category: 'Villa',
    status: 'featured',
    location: 'Bangalore',
    client: 'Luxury Client',
    price: '3200',
    explore: true,
  },
  {
    _id: '4',
    name: 'Hindustan Greens',
    description: 'Eco-friendly residential project',
    images: [{ url: '/images/image4.jpg', public_id: 'p4' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Mysore',
    client: 'Private',
    explore: true,
  },
  {
    _id: '5',
    name: 'Hindustan Trade Center',
    description: 'Business & office spaces',
    images: [{ url: '/images/image5.jpg', public_id: 'p5' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Hubli',
    client: 'Enterprise',
    price: '1800',
    explore: true,
  },
  {
    _id: '6',
    name: 'Hindustan Serenity',
    description: 'Premium retirement living',
    images: [{ url: '/images/image6.jpg', public_id: 'p6' }],
    category: 'Residential',
    status: 'completed',
    location: 'Manipal',
    client: 'Private',
    price: '1250',
    explore: true,
  },
  {
    _id: '7',
    name: 'Hindustan Aura',
    description: 'Modern urban apartments',
    images: [{ url: '/images/image7.jpg', public_id: 'p7' }],
    category: 'Residential',
    status: 'featured',
    location: 'Mangalore',
    client: 'Private',
    price: '1600',
    explore: true,
  },
  {
    _id: '8',
    name: 'Hindustan Corporate Park',
    description: 'IT & corporate office hub',
    images: [{ url: '/images/image8.jpg', public_id: 'p8' }],
    category: 'Commercial',
    status: 'ongoing',
    location: 'Bangalore',
    client: 'IT Firms',
    price: '2400',
    explore: true,
  },
  {
    _id: '9',
    name: 'Hindustan Grand Avenue',
    description: 'High-end mixed-use development',
    images: [{ url: '/images/image9.jpg', public_id: 'p9' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Chennai',
    client: 'Corporate',
    price: '2800',
    explore: true,
  },
  {
    _id: '10',
    name: 'Hindustan Palm Retreat',
    description: 'Luxury villas with private gardens',
    images: [{ url: '/images/image10.jpg', public_id: 'p10' }],
    category: 'Villa',
    status: 'completed',
    location: 'Goa',
    client: 'Luxury Client',
    price: '4500',
    explore: true,
  },
  {
    _id: '11',
    name: 'Hindustan Lake View',
    description: 'Apartments overlooking scenic lake',
    images: [{ url: '/images/image11.jpg', public_id: 'p11' }],
    category: 'Residential',
    status: 'ongoing',
    location: 'Udupi',
    client: 'Private',
    price: '1700',
    explore: true,
  },
  {
    _id: '12',
    name: 'Hindustan Sky Towers',
    description: 'High-rise luxury residences',
    images: [{ url: '/images/image12.jpg', public_id: 'p12' }],
    category: 'Residential',
    status: 'upcoming',
    location: 'Bangalore',
    client: 'Private',
    explore: false,
  },
  {
    _id: '13',
    name: 'Hindustan Business Bay',
    description: 'Retail & office commercial hub',
    images: [{ url: '/images/image13.jpg', public_id: 'p13' }],
    category: 'Commercial',
    status: 'completed',
    location: 'Kochi',
    client: 'Enterprise',
    price: '1950',
    explore: true,
  },
  {
    _id: '14',
    name: 'Hindustan Heritage Villas',
    description: 'Premium villas inspired by heritage design',
    images: [{ url: '/images/image14.jpg', public_id: 'p14' }],
    category: 'Villa',
    status: 'ongoing',
    location: 'Mysore',
    client: 'Luxury Client',
    price: '3800',
    explore: true,
  },
  {
    _id: '15',
    name: 'Hindustan Central Square',
    description: 'Integrated commercial & retail destination',
    images: [{ url: '/images/image15.jpg', public_id: 'p15' }],
    category: 'Commercial',
    status: 'featured',
    location: 'Hyderabad',
    client: 'Corporate',
    price: '2600',
    explore: true,
  },
];


  return (
    <section className="py-16 bg-neutral-50 mt-10">
      <Helmet>
        <title>Our Projects | Hindustan Builders</title>
        <meta
          name="description"
          content="Explore our residential, commercial, and luxury real estate projects. Hindustan Builders brings your dream space to life."
        />
      </Helmet>
 <section className="py-10 -mt-[56px]">
    <div
  className="relative px-4 w-full h-[300px] flex flex-col items-center justify-center bg-center bg-cover"
  style={{
    backgroundImage:
      "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(160, 160, 160, 0.3)), url('/images/pr.jpg')",
  }}
>
  <h1 className="text-4xl font-extrabold text-center uppercase text-white">
  Our Projects
  </h1>

  {/* Breadcrumb */}
  <div className="mt-2 text-sm text-white/80">
    <Link to="/" className="hover:text-white transition">
      Home
    </Link>
    <span className="mx-2">/</span>
    <span className="text-white font-medium">Projects</span>
  </div>
</div>

        
      </section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10">
          <motion.h2
            className="text-2xl font-poppins font-bold uppercase mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Projects
          </motion.h2>

          <motion.div
            className="w-20 h-1 bg-[#8a6c1a] mb-3"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const imageUrl = project.images?.[0]?.url || '/images/image1.jpg';

            return (
              <div
                key={project._id}
                className="group"
                onMouseEnter={() => setHoveredProject(project._id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl border border-gray-700 transition-transform duration-300 hover:-translate-y-2">
                  {project.explore ? (
                    <Link to={`/projects/${project._id}`}>
                      <ProjectImage project={project} imageUrl={imageUrl} />
                    </Link>
                  ) : (
                    <ProjectImage project={project} imageUrl={imageUrl} />
                  )}

                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-serif font-bold text-primary-800 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-1">
                      {project.location}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <div className="text-primary-700 font-semibold text-sm">
                        {project.price
                          ? `BUA: ${project.price} sqft`
                          : project.client}
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
      </div>
    </section>
  );
};

// 🔹 Extracted image block (clean & reusable)
const ProjectImage = ({
  project,
  imageUrl,
}: {
  project: Project;
  imageUrl: string;
}) => (
  <div className="relative h-48 overflow-hidden">
    <img
      src={imageUrl}
      alt={project.name}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/images/image1.jpg';
      }}
    />
    <div className="absolute top-4 left-4 bg-[#8a731b] text-white text-xs font-semibold py-1 px-3 rounded capitalize">
      {project.status}
    </div>
    <div className="absolute top-4 right-4 bg-primary-900 text-white text-xs font-semibold py-1 px-3 rounded">
      {project.category}
    </div>
  </div>
);

export default FeaturedProjects;
