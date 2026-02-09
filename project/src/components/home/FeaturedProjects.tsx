import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects, Project } from '../../service/ProjectService';

const FeaturedProjects = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const projects: Project[] = getFeaturedProjects();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase mb-6 text-center">
          Featured Projects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div
              key={project._id}
              className="group"
              onMouseEnter={() => setHoveredProject(project._id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="border rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-700 shadow hover:shadow-xl transition">
                <Link to={`/projects/${project._id}`}>
                  <img
                    src={project.images[0].url}
                    className="h-56 w-full object-cover "
                  />
                </Link>

                <div className="p-5">
                  <h3 className="text-lg font-display font-semibold">{project.name}</h3>
                  
 <p className="text-sm font-poppins text-gray-500 flex items-center gap-1 mt-1">
    <MapPin size={14} className="text-gray-400" strokeWidth={2.5} />
    {project.location}
  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-poppins font-semibold">
                      BUA: {project.price} sqft
                    </span>
                {project.explore && (
  <Link to={`/projects/${project._id}`} className="btn text-[#b57c6b] font-poppins">
    More
                   
                    </Link>
                    )}
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
