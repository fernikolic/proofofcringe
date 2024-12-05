import { useEffect, useState } from 'react';
import { ref, onValue, off, set } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Take } from '../types';
import { slugify } from '@/lib/utils';

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs/values/Sheet1!A2:H?key=AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ';

function getContentType(mediaUrl: string): 'video' | 'image' {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  
  // Check for video platforms
  if (
    mediaUrl.includes('youtube.com') || 
    mediaUrl.includes('youtu.be') || 
    mediaUrl.includes('vimeo.com')
  ) {
    return 'video';
  }
  
  // Check file extensions
  const extension = mediaUrl.toLowerCase().split('.').pop();
  if (extension) {
    if (videoExtensions.some(ext => ext.includes(extension))) return 'video';
    if (imageExtensions.some(ext => ext.includes(extension))) return 'image';
  }
  
  // Default to image if we can't determine
  return 'image';
}

function parseSheetData(rows: string[][]): Take[] {
  return rows.map((row, index) => ({
    id: `${index + 1}`,
    headline: row[0] || '',
    media: row[1] || '',
    description: row[2] || '',
    url: row[3] || '',
    outlet: row[4] || '',
    date: row[5] || new Date().toISOString().split('T')[0],
    votes: 0,
    bitcoinPrice: 0,
    category: row[6] || 'Uncategorized',
    slug: slugify(`${row[0]}-${row[4]}-${row[5]}`),
    contentType: getContentType(row[1] || '')
  }));
}

export function useTakes() {
  const [takes, setTakes] = useState<Take[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEETS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        if (data.values) {
          const parsedTakes = parseSheetData(data.values);
          setTakes(parsedTakes);
        }

        const votesRef = ref(db, 'votes');
        onValue(votesRef, (snapshot) => {
          const votes = snapshot.val() || {};
          setTakes(currentTakes => 
            currentTakes.map(take => ({
              ...take,
              votes: votes[take.id] || 0
            }))
          );
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load takes');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      const votesRef = ref(db, 'votes');
      off(votesRef);
    };
  }, []);

  const updateVotes = async (takeId: string, newVotes: number) => {
    try {
      await set(ref(db, `votes/${takeId}`), newVotes);
    } catch (err) {
      console.error('Failed to update votes:', err);
    }
  };

  return { takes, loading, error, updateVotes };
}

export function useTakeOfTheDay() {
  const { takes, loading, error, updateVotes } = useTakes();
  const [takeOfDay, setTakeOfDay] = useState<Take | null>(null);
  const [contentType, setContentType] = useState<'video' | 'image'>('video');

  const getRandomTake = (currentTakeId?: string) => {
    if (takes.length === 0) return null;
    
    // Filter takes by content type first
    let availableTakes = takes.filter(take => take.contentType === contentType);
    
    if (currentTakeId) {
      availableTakes = availableTakes.filter(t => t.id !== currentTakeId);
    }
    
    // If no takes of the selected type are available, return null
    if (availableTakes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableTakes.length);
    return availableTakes[randomIndex];
  };

  useEffect(() => {
    // Get a new random take when content type changes
    setTakeOfDay(getRandomTake());
  }, [contentType, takes]);

  const handleVoteAndNewTake = async (takeId: string, newVotes: number) => {
    await updateVotes(takeId, newVotes);
    setTakeOfDay(getRandomTake(takeId));
  };

  return { 
    take: takeOfDay, 
    loading, 
    error,
    updateVotes: handleVoteAndNewTake,
    contentType,
    setContentType
  };
}

export function useTake(slug: string | undefined) {
  const { takes, loading: takesLoading, error: takesError } = useTakes();
  const [take, setTake] = useState<Take | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No slug provided');
      setLoading(false);
      return;
    }

    if (takesLoading) {
      return;
    }

    const foundTake = takes.find(t => t.slug === slug);
    
    if (!foundTake) {
      setError('Take not found');
      setTake(null);
    } else {
      setTake(foundTake);
    }
    
    setLoading(false);
  }, [slug, takes, takesLoading]);

  const updateVotes = async (takeId: string, newVotes: number) => {
    try {
      await set(ref(db, `votes/${takeId}`), newVotes);
    } catch (err) {
      console.error('Failed to update votes:', err);
    }
  };

  return { take, loading: loading || takesLoading, error: error || takesError, updateVotes };
}