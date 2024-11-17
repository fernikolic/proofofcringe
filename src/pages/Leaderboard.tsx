import React, { useState } from 'react';
import { Trophy, ArrowUp, Loader } from 'lucide-react';
import TakeCard from '../components/TakeCard';
import YearFilter from '../components/YearFilter';
import { useTakes } from '../hooks/useTakes';
import SEO from '../components/SEO';

export default function Leaderboard() {
  const [selectedYear, setSelectedYear] = useState('All Time');
  const { takes, loading, error, updateVotes } = useTakes();

  const filteredTakes = takes
    .filter(take => {
      if (selectedYear === 'All Time') return true;
      const takeYear = new Date(take.date).getFullYear().toString();
      if (selectedYear === 'Pre-2020') return parseInt(takeYear) < 2020;
      return takeYear === selectedYear;
    })
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Hall of Shame - Proof of Cringe"
        description="The most catastrophically wrong Bitcoin takes, ranked by the community."
      />
      <header className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-4xl font-bold text-orange-500">
            Hall of Shame
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          The most catastrophically wrong Bitcoin takes, ranked by the community.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 bg-gray-950/80 backdrop-blur-sm z-10 p-4 -mx-4">
          <YearFilter 
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 text-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            {error}
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {filteredTakes.map((take, index) => (
              <div key={take.id} className="relative">
                {index < 3 && (
                  <div className="absolute -left-4 -top-4 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center z-10">
                    <ArrowUp className="h-5 w-5" />
                  </div>
                )}
                <TakeCard 
                  take={take}
                  onVote={(newVotes) => updateVotes(take.id, newVotes)}
                />
              </div>
            ))}

            {filteredTakes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No takes found for the selected year.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}