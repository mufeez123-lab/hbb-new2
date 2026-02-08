import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { getAllProjects, Project } from '../service/ProjectService';

const ProjectsPage = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const projects: Project[] = getAllProjects();

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold uppercase mb-8">Our Projects</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div
              key={project._id}
              onMouseEnter={() => setHovered(project._id)}
              onMouseLeave={() => setHovered(null)}
              className="group"
            >
              <div className="bg-white border rounded-lg shadow hover:shadow-xl transition">
                <Link to={`/projects/${project._id}`}>
                  <img
                    src={project.images[0].url}
                    className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>

                <div className="p-5">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.location}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-semibold">
                      {project.price ? `BUA: ${project.price} sqft` : project.client}
                    </span>

                    <Link
                      to={`/projects/${project._id}`}
                      className="flex items-center text-[#8a731b]"
                    >
                      Explore
                      <ArrowRight
                        size={16}
                        className={`ml-1 transition ${
                          hovered === project._id ? 'translate-x-1' : ''
                        }`}
                      />
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

export default ProjectsPage;
