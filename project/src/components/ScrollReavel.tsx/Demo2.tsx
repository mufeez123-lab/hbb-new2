'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from './Scroll2';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  image: {
    src: '/images/image1.jpg',
    background: '/images/abt.jpg',
    title: 'Get in touch with us ',
    date: 'Underwater Adventure',
    scrollToExpand: 'Scroll to Expand Demo',
    about: {
      overview:
        'This is a demonstration of the ScrollExpandMedia component with an image. The smooth expansion effect works beautifully with static images, allowing you to create engaging visual experiences.',
      conclusion:
        'The ScrollExpandMedia component provides a unique way to engage users with high-quality photography through interactive scrolling.',
    },
  },
  gallery: {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop',
    title: 'Nature Perspective',
    date: 'Forest Expedition',
    scrollToExpand: 'Scroll to Reveal',
    about: {
      overview:
        'Using static imagery reduces bandwidth while maintaining a high-end feel. This secondary image example shows how versatile the transition is across different color palettes.',
      conclusion:
        'By utilizing sharp focal points, you can guide the user\'s eye as the container expands to full-bleed.',
    },
  },
};

// const MediaContent = ({ mediaType }: { mediaType: string }) => {
//   const currentMedia = sampleMediaContent[mediaType];

//   return (
//     <div className='max-w-4xl mx-auto'>
//       <h2 className='text-3xl font-bold mb-6 text-black dark:text-white'>
//         About This Image Experience
//       </h2>
//       <p className='text-lg mb-8 text-black dark:text-white'>
//         {currentMedia.about.overview}
//       </p>
//       <p className='text-lg mb-8 text-black dark:text-white'>
//         {currentMedia.about.conclusion}
//       </p>
//     </div>
//   );
// };

// --- Specialized Export Variations ---

export const ImageExpansionTextBlend = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resetSection'));
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend
      >
        {/* <MediaContent mediaType={mediaType} /> */}
      </ScrollExpandMedia>
    </div>
  );
};

export const ImageExpansion = () => {
  const mediaType = 'image';
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resetSection'));
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        {/* <MediaContent mediaType={mediaType} /> */}
      </ScrollExpandMedia>
    </div>
  );
};

// --- Main Demo Component ---

const Demo = () => {
  const [mediaType, setMediaType] = useState('image');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resetSection'));
  }, [mediaType]);

  return (
    <div className='min-h-screen'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
      
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        {/* <MediaContent mediaType={mediaType} /> */}
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;