import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getAll();
        setProjects(data);
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

  return (
    <section className="py-16 bg-neutral-50 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="text-left mb-10"
        >
          <h2 className="text-2xl font-semibold text-neutral-800 mt-10">Our Projects</h2>
          <div className="w-20 h-1 bg-[#8a731b] mt-2"></div>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center">
            <p className="text-neutral-600">
              We're currently curating some standout properties. Please check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const imageObj = project.images?.[0];
              const imageUrl = imageObj?.url || '/images/image1.jpg';

              const imageContent = (
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={project.name}
                    loading="lazy"
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
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-2">
                    
                    {project.explore ? (
                      <Link to={`/projects/${project._id}`} className="block">
                        {imageContent}
                      </Link>
                    ) : (
                      imageContent
                    )}

                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg font-serif font-bold text-primary-800 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-1">{project.location}</p>

                      <div className="flex justify-between items-center mt-3">
                        <div className="text-primary-700 font-semibold text-sm">
                          {project.price
                            ? `BUA: ${project.price}${/\d$/.test(project.price) ? ' sqft' : ''}`
                            : project.client}
                        </div>

                        {project.explore && (
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
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
