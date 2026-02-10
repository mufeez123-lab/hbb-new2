import { useState } from 'react';
import { ArrowRight, MapPin} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects, Project } from '../../service/ProjectService';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedProjects = () => {
  const projects: Project[] = getFeaturedProjects();
  
  // Create state to hold navigation elements
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <header className="flex items-center mb-16">
          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="px-6 text-lg uppercase tracking-[0.2em] font-medium text-gray-800 text-center">
            Our featured projects
          </h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </header>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          // Link navigation to our state elements
          navigation={{ prevEl, nextEl }}
         onBeforeInit={(swiper) => {
  const nav = swiper.params.navigation;
  if (nav && typeof nav !== 'boolean') {
    nav.prevEl = prevEl;
    nav.nextEl = nextEl;
  }
}}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="relative group"
        >
          {projects.map((project) => (
            <SwiperSlide key={project._id} className="pb-12">
              <div className="group/card">
                <div className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-500 bg-white">
                  <Link to={`/projects/${project._id}`} className="block overflow-hidden">
                    <img
                      src={project.images[0].url}
                      alt={project.name}
                      className="h-[56vh] w-full object-cover group-hover/card:scale-110 transition-transform duration-700"
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
                        <Link 
                          to={`/projects/${project._id}`} 
                          className="text-[#b57c6b] font-poppins flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          More <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

     
      </div>
    </section>
  );
};

export default FeaturedProjects;