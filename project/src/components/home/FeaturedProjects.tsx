import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  status: string;
  location: string;
  client: string;
  price?: string;
}

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const API_BASE = 'https://hbb-new2.onrender.com';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getAll();
        const featured = data.filter((p: Project) => p.status === 'featured');
        setProjects(featured);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        setError('Unable to fetch project highlights at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading amazing spaces...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  const mainFeatured = projects.slice(0, 3);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-neutral-800">Featured Projects</h2>
            <div className="w-20 h-1 bg-[#8a6c1a] mx-auto mt-2 mb-4"></div>
          </motion.div>
        </div>

        {mainFeatured.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral-600">
              We're currently curating some standout properties. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {mainFeatured.map((project, index) => {
              const image = project.images?.[0];
              const isImageString = typeof image === 'string';
              const imageUrl = isImageString
                ? image.startsWith('http')
                  ? image
                  : `${API_BASE}${image}`
                : '/images/image1.jpg';

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                  onMouseEnter={() => setHoveredProject(project._id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div className="relative h-48 sm:h-52 md:h-60 lg:h-52 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={project.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/image1.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#8a731b] text-white text-xs py-1 px-3 rounded capitalize">
                        {project.status}
                      </div>
                      <div className="absolute top-3 right-3 bg-primary-900 text-white text-xs py-1 px-3 rounded">
                        {project.category}
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-primary-800 mb-1">
                        {project.name}
                      </h3>
                      <div className="text-neutral-500 text-sm mb-2">{project.location}</div>

                      <div className="flex justify-between items-center">
                        <div className="text-primary-700 font-semibold text-sm sm:text-base">
                          {project.price ? `₹${project.price}` : project.client}
                        </div>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-[#8a731b] hover:text-[#8a731b] inline-flex items-center font-medium focus:outline-none focus:ring-2 focus:ring-secondary-500 rounded"
                        >
                          Explore
                          <ArrowRight
                            size={16}
                            className={`ml-1 transition-transform duration-300 ${
                              hoveredProject === project._id ? 'translate-x-1' : ''
                            }`}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center bg-[#a0841f] hover:bg-[#8a731b] text-white px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#a0841f]"
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
