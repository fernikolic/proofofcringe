import React from 'react';
import { format } from 'date-fns';
import { Clock3, TrendingUp } from 'lucide-react';
import { MOCK_TAKES } from '../data/mockTakes';
import TakeCard from '../components/TakeCard';

const PRICE_MILESTONES = [
  { date: '2013-11-29', price: 1242, event: 'First time Bitcoin crossed $1,000' },
  { date: '2017-12-17', price: 19783, event: 'Early bull market peak' },
  { date: '2021-11-10', price: 69000, event: 'All-time high' },
  { date: '2024-03-14', price: 73000, event: 'New all-time high' },
];

export default function Timeline() {
  const timelineEvents = [...MOCK_TAKES, ...PRICE_MILESTONES]
    .map(event => ({
      date: new Date(event.date),
      type: 'price' in event ? 'milestone' : 'take',
      data: event,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Clock3 className="h-8 w-8 text-orange-500 mr-3" />
          <h1 className="text-4xl font-bold text-orange-500">
            Timeline of Takes
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Watch Bitcoin grow while critics get it wrong, again and again.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800" />

          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <div key={index} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 
                  ${event.type === 'milestone' 
                    ? 'bg-green-500 border-green-600' 
                    : 'bg-orange-500 border-orange-600'}`} 
                />

                {/* Date label */}
                <div className="absolute left-12 -translate-y-1/2 bg-gray-900 text-gray-400 text-sm px-2 py-1 rounded-md">
                  {format(event.date, 'MMM d, yyyy')}
                </div>

                <div className="mt-8">
                  {event.type === 'milestone' ? (
                    <div className="bg-gray-900/50 rounded-xl p-6 border border-green-500/20">
                      <div className="flex items-center space-x-2 text-green-500 mb-2">
                        <TrendingUp className="h-5 w-5" />
                        <h3 className="font-bold text-lg">Price Milestone</h3>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">
                        ${(event.data.price).toLocaleString()}
                      </p>
                      <p className="text-gray-400">{event.data.event}</p>
                    </div>
                  ) : (
                    <TakeCard take={event.data} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}