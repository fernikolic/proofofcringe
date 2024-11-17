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
      <div className="flex justify-center items-center py-12">
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

  const take = takes.find(t => t.slug === slug);

  if (!take) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SEO
        title={`${take.headline} - Proof of Cringe`}
        description={take.description}
        image={take.media}
        type="article"
      />
      <TakeCard 
        take={take}
        onVote={(newVotes) => updateVotes(take.id, newVotes)}
      />
    </div>
  );
}