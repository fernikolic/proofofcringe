import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  headline?: string;
  outlet?: string;
}

export default function SEO({ 
  title = 'Proof of Cringe - Bitcoin Takes Hall of Shame',
  description = 'Explore and rank the worst Bitcoin takes',
  image = 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&h=630&q=80',
  url = window.location.href,
  type = 'website',
  headline,
  outlet
}: SEOProps) {
  const siteName = 'Proof of Cringe';
  const twitterHandle = '@bitcoinperc';

  // Optimize title for social sharing
  const socialTitle = headline 
    ? `"${headline}" - ${outlet} | Proof of Cringe`
    : title;

  // Optimize description for social sharing
  const socialDescription = headline
    ? `Check out this terrible Bitcoin take from ${outlet}: "${headline}"`
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={headline || 'Proof of Cringe'} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}