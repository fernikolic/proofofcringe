import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Proof Of Cringe',
    template: '%s | Proof Of Cringe'
  },
  description: 'A curated library of the most legendary and hilariously horrible Bitcoin takes from mainstream media over the years. Prepare to cringe! 😬',
  keywords: ['bitcoin cringe', 'crypto fails', 'bitcoin predictions', 'wrong bitcoin takes', 'bitcoin fud', 'crypto journalism fails', 'bitcoin criticism', 'mainstream media bitcoin', 'bitcoin skeptics', 'bitcoin obituaries'],
  authors: [{ name: 'Proof Of Cringe' }],
  creator: 'Proof Of Cringe',
  metadataBase: new URL('https://proofofcringe.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://proofofcringe.com',
    siteName: 'Proof Of Cringe',
    title: 'Proof Of Cringe 😬',
    description: 'A curated library of the most legendary and hilariously horrible Bitcoin takes from mainstream media over the years. Prepare to cringe! 😬',
    images: [
      {
        url: 'https://i.ytimg.com/vi/4AV0gaIhehQ/maxresdefault.jpg',
        width: 1280,
        height: 720,
        alt: 'Bitcoin Cringe Collection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proof Of Cringe 😬',
    description: 'A curated library of the most legendary and hilariously horrible Bitcoin takes from mainstream media over the years. Prepare to cringe! 😬',
    creator: '@proofofcringe',
    images: ['https://i.ytimg.com/vi/4AV0gaIhehQ/maxresdefault.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/emoji-cringe.png' }],
    shortcut: ['/emoji-cringe.png'],
  },
}

// Rest of your layout component... 