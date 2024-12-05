import React, { useState, useEffect } from 'react';
import { Trophy, ArrowUp, Loader } from 'lucide-react';
import TakeCard from '../components/TakeCard';
import YearFilter from '../components/YearFilter';
import { useTakes } from '../hooks/useTakes';
import SEO from '../components/SEO';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const [selectedYear, setSelectedYear] = useState('All Time');
  const { takes, loading, error, updateVotes } = useTakes();
  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 200px
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse year from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const yearParam = params.get('year');
    if (yearParam) {
      setSelectedYear(yearParam);
    }
  }, [location]);

  // Update URL when year changes
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    const params = new URLSearchParams();
    if (year !== 'All Time') {
      params.set('year', year);
    }
    navigate({ search: params.toString() });
  };

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
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 -mx-4 border-b border-border/50">
          <YearFilter 
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
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
            {filteredTakes.map((take) => (
              <div key={take.id} className="relative">
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

        {showScrollTop && (
          <div 
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-all duration-200 shadow-lg hover:scale-110 animate-fade-in"
          >
            <ArrowUp className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}