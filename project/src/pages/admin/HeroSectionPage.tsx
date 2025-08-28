import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<<<<<<< HEAD

interface HeroImage {

  _id: string;

  url: string;

  public_id: string;

}


const HeroSectionPage: React.FC = () => {

  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [open, setOpen] = useState(false);

  const [uploading, setUploading] = useState(false);



  const fetchHeroImages = async () => {

    try {

      const res = await api.get('/admin/hero');

      setHeroImages(res.data.images || []);

    } catch (err) {

      console.error('Fetch hero failed:', err);

    }

  };



  useEffect(() => {

    fetchHeroImages();

  }, []);



  const handleUpload = async () => {

    if (!selectedFiles || selectedFiles.length === 0) return;



    const formData = new FormData();

    Array.from(selectedFiles).forEach((file) => formData.append('images', file));



    try {

      setUploading(true);

      const res = await api.post('/admin/hero', formData, {

        headers: { 'Content-Type': 'multipart/form-data' },

      });

      setHeroImages(res.data?.images || []);

      setOpen(false);

      setSelectedFiles(null);

      toast.success('Images uploaded successfully!');

    } catch (err) {

      console.error('Upload failed:', err);

      toast.error('Image upload failed.');

    } finally {

      setUploading(false);

    }

  };



  const handleDelete = async (id: string) => {

    try {

      await api.delete(`/admin/hero/${id}`, {

        headers: {

          Authorization: `Bearer ${localStorage.getItem('token')}`,

        },

      });



      setHeroImages((prev) => prev.filter((img) => img._id !== id));

      toast.success('Image deleted successfully!');

    } catch (err) {

      console.error('Delete failed:', err);

      toast.error('Failed to delete image.');

    }

  };



  return (

    <div className="min-h-screen bg-gray-50">

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-4 ml-0">

          <div className="max-w-5xl mx-auto mt-20">

            <div className="flex justify-between items-center mb-6">

              <h1 className="text-2xl font-semibold">Hero Section</h1>

              <button

                onClick={() => setOpen(true)}

                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"

              >

                Upload Images

              </button>

            </div>



            {heroImages.length > 0 ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {heroImages.map((img) => (

                  <div key={img.public_id} className="relative bg-white shadow rounded overflow-hidden">

                    <img

                      src={img.url}

                      alt="Hero"

                      className="w-full h-64 object-cover"

                    />

                    <button

                      onClick={() => handleDelete(img._id)}

                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"

                    >

                      ✕

                    </button>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-gray-500">No hero images uploaded yet.</p>

            )}

          </div>

        </main>

      </div>



      {open && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Upload Hero Images</h2>

            <div className="space-y-4">

              <input

                type="file"

                accept="image/*"

                multiple

                onChange={(e) => setSelectedFiles(e.target.files)}

                className="w-full border px-3 py-2 rounded-md"

              />

              <div className="flex justify-end gap-4">

                <button

                  onClick={() => {

                    setOpen(false);

                    setSelectedFiles(null);

                  }}

                  className="px-4 py-2 text-gray-600 hover:text-gray-800"

                >

                  Cancel

                </button>

                <button

                  onClick={handleUpload}

                  disabled={!selectedFiles || uploading}

                  className={`px-4 py-2 rounded-md text-white ${

                    selectedFiles && !uploading

                      ? 'bg-primary-600 hover:bg-primary-700'

                      : 'bg-gray-400 cursor-not-allowed'

                  }`}

                >

                  {uploading ? 'Uploading...' : 'Upload'}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}



      <ToastContainer position="top-right" autoClose={3000} />

    </div>

  );

};



export default HeroSectionPage
=======
interface HeroImage {
  _id: string;
  url: string;
  public_id: string;
}

const HeroSectionPage: React.FC = () => {
  const [desktopHeroImages, setDesktopHeroImages] = useState<HeroImage[]>([]);
  const [mobileHeroImages, setMobileHeroImages] = useState<HeroImage[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'desktop' | 'mobile' | null>(null);

  // Fetch hero images from backend
  const fetchHeroImages = async () => {
    try {
      const res = await api.get('/admin/hero'); // single endpoint
      setDesktopHeroImages(res.data.desktopImages || []);
      setMobileHeroImages(res.data.mobileImages || []);
    } catch (err) {
      console.error('Fetch hero failed:', err);
    }
  };

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !uploadType) return;

    const formData = new FormData();
    const validFiles: File[] = [];

    // Validate aspect ratio for desktop (landscape) / mobile (portrait)
    const validationPromises = Array.from(selectedFiles).map((file) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (uploadType === 'desktop' && img.width >= img.height) {
            validFiles.push(file);
          } else if (uploadType === 'mobile' && img.height >= img.width) {
            validFiles.push(file);
          } else {
            toast.error(
              `Skipping ${file.name}: Incorrect aspect ratio for ${uploadType} upload.`
            );
          }
          resolve();
        };
        img.onerror = () => {
          toast.error(`Could not read file: ${file.name}`);
          resolve();
        };
        img.src = URL.createObjectURL(file);
      });
    });

    await Promise.all(validationPromises);

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    validFiles.forEach((file) => formData.append('images', file));

    try {
      setUploading(true);
      const endpoint =
        uploadType === 'desktop' ? '/admin/hero/desktop' : '/admin/hero/mobile';
      const res = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (uploadType === 'desktop') {
        setDesktopHeroImages(res.data.desktopImages || []);
      } else {
        setMobileHeroImages(res.data.mobileImages || []);
      }

      setOpen(false);
      setSelectedFiles(null);
      setUploadType(null);
      toast.success('Images uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'desktop' | 'mobile') => {
    try {
      const endpoint =
        type === 'desktop' ? `/admin/hero/desktop/${id}` : `/admin/hero/mobile/${id}`;
      const res = await api.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (type === 'desktop') {
        setDesktopHeroImages(res.data.images || []);
      } else {
        setMobileHeroImages(res.data.images || []);
      }

      toast.success('Image deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete image.');
    }
  };

  const openModal = (type: 'desktop' | 'mobile') => {
    setUploadType(type);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 ml-0">
          <div className="max-w-5xl mx-auto mt-20">
            <h1 className="text-3xl font-bold mb-8">Hero Section Management</h1>

            {/* Desktop Hero Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Desktop Images</h2>
                <button
                  onClick={() => openModal('desktop')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"
                >
                  Upload Desktop Images
                </button>
              </div>
              {desktopHeroImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {desktopHeroImages.map((img) => (
                    <div
                      key={img.public_id}
                      className="relative bg-white shadow rounded overflow-hidden"
                    >
                      <img
                        src={img.url}
                        alt="Desktop Hero"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => handleDelete(img._id, 'desktop')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No desktop hero images uploaded yet.</p>
              )}
            </div>

            {/* Mobile Hero Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Mobile Images</h2>
                <button
                  onClick={() => openModal('mobile')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none"
                >
                  Upload Mobile Images
                </button>
              </div>
              {mobileHeroImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {mobileHeroImages.map((img) => (
                    <div
                      key={img.public_id}
                      className="relative bg-white shadow rounded overflow-hidden"
                    >
                      <img
                        src={img.url}
                        alt="Mobile Hero"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => handleDelete(img._id, 'mobile')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No mobile hero images uploaded yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Upload {uploadType === 'desktop' ? 'Desktop' : 'Mobile'} Images
            </h2>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setSelectedFiles(null);
                    setUploadType(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFiles || uploading}
                  className={`px-4 py-2 rounded-md text-white ${
                    selectedFiles && !uploading
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default HeroSectionPage;
>>>>>>> e881c3a32c2c54c08739016776766e447fd074cd
