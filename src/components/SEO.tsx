import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  meta?: Array<{
    property: string;
    content: string;
  }>;
  twitterCard?: string;
  twitterSite?: string;
  publishedTime?: string;
  author?: string;
}

export default function SEO({ 
  title = "Proof of Cringe - Bitcoin's Worst Takes",
  description = "A collection of the most catastrophically wrong Bitcoin takes, preserved for posterity.",
  image,
  type = "website",
  meta = [],
  twitterCard = "summary_large_image",
  twitterSite = "@proofofcringe",
  publishedTime,
  author
}: SEOProps) {
  const siteUrl = window.location.origin;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Proof of Cringe" />
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:alt" content={description} />
        </>
      )}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Additional meta tags */}
      {meta.map(({ property, content }) => (
        <meta key={property} property={property} content={content} />
      ))}
    </Helmet>
  );
}