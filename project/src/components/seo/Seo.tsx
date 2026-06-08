import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string; // Optional: e.g., 'website' or 'article'
  image?: string; // Optional: for social media sharing
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  path, 
  type = 'website',
  image = 'https://hindustanbuilders.in/default-og-image.jpg' 
}) => {
  const url = `https://hindustanbuilders.in${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;