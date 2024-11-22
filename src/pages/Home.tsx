import React from 'react';
import TakeCard from '../components/TakeCard';
import { useTakeOfTheDay } from '../hooks/useTakes';
import { Loader } from 'lucide-react';
import SEO from '../components/SEO';

export default function Home() {
  const { take, loading, error, updateVotes } = useTakeOfTheDay();

  return (
    <div className="space-y-8">
      <SEO />
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">
          {error}
        </div>
      ) : take ? (
        <TakeCard 
          take={take}
          onVote={(newVotes) => updateVotes(take.id, newVotes)}
        />
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>No takes available yet.</p>
          <a href="/submit" className="text-orange-500 hover:text-orange-400 mt-2 inline-block transition-all duration-300 hover:scale-105">
            Be the first to submit one!
          </a>
        </div>
      )}
    </div>
  );
}