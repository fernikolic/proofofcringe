import React from 'react';
import TakeCard from '../components/TakeCard';
import { useTakeOfTheDay } from '../hooks/useTakes';
import { Loader, Video, Newspaper } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from "@/components/ui/button";

export default function Home() {
  const { 
    take, 
    loading, 
    error, 
    updateVotes, 
    contentType, 
    setContentType 
  } = useTakeOfTheDay();

  return (
    <div className="space-y-4">
      <SEO />
      
      <div className="flex justify-center gap-2">
        <Button
          variant={contentType === 'video' ? 'default' : 'outline'}
          onClick={() => setContentType('video')}
          className="flex items-center"
          size="sm"
        >
          <Video className="w-4 h-4 mr-2" />
          Videos
        </Button>
        <Button
          variant={contentType === 'image' ? 'default' : 'outline'}
          onClick={() => setContentType('image')}
          className="flex items-center"
          size="sm"
        >
          <Newspaper className="w-4 h-4 mr-2" />
          Headlines
        </Button>
      </div>

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
          <p>No {contentType === 'video' ? 'videos' : 'headlines'} available yet.</p>
          <a href="/submit" className="text-orange-500 hover:text-orange-400 mt-2 inline-block transition-all duration-300 hover:scale-105">
            Be the first to submit one!
          </a>
        </div>
      )}
    </div>
  );
}