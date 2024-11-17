import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Bitcoin, Trophy, Send, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const navItems = [
    { to: '/', label: 'Daily Take', icon: Bitcoin },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/submit', label: 'Submit', icon: Send },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
        >
          <Bitcoin className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
            Proof Of Cringe
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2",
                  isActive && "bg-accent text-accent-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              <span>{label}</span>
            </NavLink>
          ))}
          <a
            href="https://bitcoinperception.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <Bitcoin className="h-4 w-4 mr-2" />
            <span>By Bitcoin Perception</span>
            <ExternalLink className="h-3 w-3 ml-1.5 opacity-70" />
          </a>
        </div>
      </div>
    </nav>
  );
}