import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useTake } from '../hooks/useTakes';
import TakeCard from '../components/TakeCard';
import { Loader } from 'lucide-react';
import SEO from '../components/SEO';

export default function TakeDetails() {
  const { slug } = useParams();
  const { take, loading, error, updateVotes } = useTake(slug);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !take) {
    return <Navigate to="/" replace />;
  }

  const title = take.headline 
    ? `"${take.headline}" - ${take.outlet}`
    : `${take.outlet}'s Bitcoin Take - Proof of Cringe`;

  const description = take.description;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title={title}
        description={description}
        image={take.media}
        type="article"
        publishedTime={new Date(take.date).toISOString()}
        author={take.outlet}
        twitterCard="summary_large_image"
        twitterSite="@proofofcringe"
        meta={[
          {
            property: 'og:url',
            content: `${window.location.origin}/take/${take.slug}`
          },
          {
            property: 'canonical',
            content: `${window.location.origin}/take/${take.slug}`
          },
          {
            property: 'article:section',
            content: take.category || 'Bitcoin'
          },
          {
            property: 'og:article:published_time',
            content: new Date(take.date).toISOString()
          },
          {
            property: 'og:article:author',
            content: take.outlet
          }
        ]}
      />
      
      <div className="max-w-3xl mx-auto">
        <TakeCard 
          take={take}
          onVote={(newVotes) => updateVotes(take.id, newVotes)}
          showShareButton
        />
      </div>
    </div>
  );
}