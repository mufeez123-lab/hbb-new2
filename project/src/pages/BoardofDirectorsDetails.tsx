import { useParams, Link } from 'react-router-dom';
import { directorsData, Director } from '../data/directors';

const BoardOfDirectorDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const director: Director | undefined = directorsData.find(
    (item) => item._id === id
  );

  if (!director) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-neutral-600 mb-4">
          Director details not found.
        </p>
        <Link to="/about" className="text-sm underline">
          Go back to About
        </Link>
      </div>
    );
  }

  const imageURL =
    typeof director.image === 'string'
      ? director.image
      : director.image.url;

  return (
    <div className="max-w-7xl mx-auto px-4 py-28">
      {/* Back Link */}
      <Link
        to="/about"
        className="text-sm text-neutral-100 hover:underline md:ml-56 py-2 px-2 rounded-md  bg-[#b57c6b]"
      >
        ← Back 
      </Link>

      {/* Main Card */}
      <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* LEFT: IMAGE */}
          <div className="md:w-1/3 w-full bg-neutral-100 font-poppins">
            <img
              src={imageURL}
              alt={director.name}
              className="w-full h-full min-h-[420px]  object-cover object-top"
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="md:w-2/3 w-full p-6 md:p-10">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              {director.name}
            </h1>

            <p className="text-lg font-medium text-[#8a6c1a] mb-6">
              {director.position}
            </p>

            {director.bio ? (
              <div
                className="text-neutral-700 leading-relaxed text-justify space-y-4"
                dangerouslySetInnerHTML={{ __html: director.bio }}
              />
            ) : (
              <p className="italic text-neutral-500">
                Bio information is not available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardOfDirectorDetailPage;
