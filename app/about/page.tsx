import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Proof Of Cringe',
  description: 'Learn about our mission to document and preserve the most legendary Bitcoin takes that aged like milk. A historical record of mainstream media\'s greatest Bitcoin moments.',
  openGraph: {
    title: 'About Proof Of Cringe',
    description: 'Learn about our mission to document and preserve the most legendary Bitcoin takes that aged like milk. A historical record of mainstream media\'s greatest Bitcoin moments.',
    type: 'article',
    url: 'https://proofofcringe.com/about',
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
    site: '@proofofcringe',
    creator: '@proofofcringe',
    title: 'About Proof Of Cringe 😬',
    description: 'Learn about our mission to document and preserve the most legendary Bitcoin takes that aged like milk.',
    images: 'https://i.ytimg.com/vi/4AV0gaIhehQ/maxresdefault.jpg'
  }
}

export default function AboutPage() {
  return (
    <div>About Page Content</div>
  )
} 