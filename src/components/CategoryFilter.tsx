import React from 'react';
import { Hash } from 'lucide-react';

const categories = [
  'Price Prediction',
  'Energy FUD',
  'Death Spiral',
  'Regulation',
  'Technology',
  'All Categories'
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors
            ${selectedCategory === category 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
        >
          <Hash className="h-4 w-4" />
          <span>{category}</span>
        </button>
      ))}
    </div>
  );
}