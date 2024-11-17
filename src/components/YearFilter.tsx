import React from 'react';
import { CalendarDays } from 'lucide-react';

const years = ['All Time', '2024', '2023', '2022', '2021', '2020', 'Pre-2020'];

interface YearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export default function YearFilter({ selectedYear, onYearChange }: YearFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
      <CalendarDays className="h-5 w-5 text-gray-400 flex-shrink-0" />
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
            ${selectedYear === year 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}