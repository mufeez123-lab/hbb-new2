import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects, Project } from '../../service/ProjectService';

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const FeaturedProjects = () => {
  const projects: Project[] = getFeaturedProjects();

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
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
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
                          className="btn text-[#b57c6b] font-poppins flex items-center gap-1 hover:gap-2 transition-all"
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

          {/* Custom Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-4">
            <button className="swiper-button-prev-custom p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="swiper-button-next-custom p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedProjects;