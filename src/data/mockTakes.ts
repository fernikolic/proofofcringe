import type { Take } from '../types';

export const MOCK_TAKES: Take[] = [
  {
    id: '1',
    author: 'Paul Krugman',
    quote: "Bitcoin's value will be zero and will disappear by 2018.",
    date: '2013-12-15',
    context: 'Nobel laureate economist Paul Krugman predicted Bitcoin\'s demise in his New York Times column.',
    source: 'New York Times',
    category: 'Price Prediction',
    votes: 2481,
    bitcoinPrice: 870
  },
  {
    id: '2',
    author: 'Jamie Dimon',
    quote: "Bitcoin is a fraud that will eventually blow up.",
    date: '2017-09-12',
    context: 'JPMorgan CEO Jamie Dimon made this statement at the Delivering Alpha conference.',
    source: 'CNBC',
    category: 'Price Prediction',
    votes: 1923,
    bitcoinPrice: 4148
  },
  {
    id: '3',
    author: 'Peter Schiff',
    quote: "Bitcoin is going to collapse to $1,000 by the end of 2023.",
    date: '2023-01-01',
    context: 'Gold bug Peter Schiff made yet another Bitcoin price prediction.',
    source: 'Twitter',
    category: 'Price Prediction',
    votes: 1756,
    bitcoinPrice: 16500
  },
  {
    id: '4',
    author: 'Bill Gates',
    quote: "Bitcoin uses more electricity per transaction than any other method known to mankind.",
    date: '2021-03-09',
    context: 'Microsoft co-founder Bill Gates criticized Bitcoin\'s energy consumption.',
    source: 'New York Times',
    category: 'Energy FUD',
    votes: 1544,
    bitcoinPrice: 54824
  }
];