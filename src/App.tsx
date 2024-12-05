import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Submit from './pages/Submit';
import TakeDetails from './pages/TakeDetails';
import { Toaster } from './components/ui/toaster';
import SEO from './components/SEO';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="proof-of-cringe-theme">
      <HelmetProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <SEO />
            <Navigation />
            <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/submit" element={<Submit />} />
                <Route path="/take/:slug" element={<TakeDetails />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}