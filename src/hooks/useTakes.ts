import { useEffect, useState } from 'react';
import { ref, onValue, off, set } from 'firebase/database';
import { db } from '../lib/firebase';
import type { Take } from '../types';

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets/1L_8B_G50Y0oHJ46IWmspRYS5l_VcWr_MU5qR9lBcMQs/values/Sheet1!A2:H?key=AIzaSyC3oGB9sdUrokD-OrMdx0ol0TBdhf2gudQ';

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
    category: 'Uncategorized'
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

  const getRandomTake = (currentTakeId?: string) => {
    if (takes.length === 0) return null;
    
    let availableTakes = takes;
    if (currentTakeId) {
      availableTakes = takes.filter(t => t.id !== currentTakeId);
    }
    
    const randomIndex = Math.floor(Math.random() * availableTakes.length);
    return availableTakes[randomIndex];
  };

  useEffect(() => {
    if (takes.length > 0 && !takeOfDay) {
      setTakeOfDay(getRandomTake());
    }
  }, [takes]);

  const handleVoteAndNewTake = async (takeId: string, newVotes: number) => {
    await updateVotes(takeId, newVotes);
    setTakeOfDay(getRandomTake(takeId));
  };

  return { 
    take: takeOfDay, 
    loading, 
    error,
    updateVotes: handleVoteAndNewTake
  };
}