export interface Take {
  id: string;
  outlet: string;
  description: string;
  date: string;
  votes: number;
  media?: string;
  url: string;
  slug: string;
  headline?: string;
  contentType: 'video' | 'image';
  category?: string;
}

export interface TakeOfTheDay extends Take {
  outcome: string;
}