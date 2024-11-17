import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import TakeCard from '../components/TakeCard';
import { useTakes } from '../hooks/useTakes';
import SEO from '../components/SEO';

export default function TakeDetails() {
  const { slug } = useParams();
  const { takes, loading, error, updateVotes } = useTakes();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-12">
        {error}
      </div>
    );
  }

  const take = takes.find(t => t.id === slug);

  if (!take) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <SEO
        title={`${take.headline} - Proof of Cringe`}
        description={take.description}
        image={take.media}
        headline={take.headline}
        outlet={take.outlet}
        type="article"
      />
      <div className="max-w-4xl mx-auto">
        <TakeCard 
          take={take}
          onVote={(newVotes) => updateVotes(take.id, newVotes)}
          showShareButton
        />
      </div>
    </div>
  );
}