export interface Take {
  id: string;
  headline: string;
  media?: string;
  description: string;
  url: string;
  outlet: string;
  date: string;
  slug: string;
  votes: number;
  bitcoinPrice: number;
  category: string;
}

export interface TakeOfTheDay extends Take {
  outcome: string;
}