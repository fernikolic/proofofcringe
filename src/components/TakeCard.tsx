import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Share2, ThumbsUp, ThumbsDown, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { Link, useLocation } from 'react-router-dom';
import type { Take } from '../types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TakeCardProps {
  take: Take;
  onVote?: (newVotes: number) => void;
  showShareButton?: boolean;
}

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4"
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const VOTE_MESSAGES = {
  up: [
    "Ultra cringe! Adding to the hall of shame! 🏆",
    "Maximum cope detected! 🚨",
    "That's going in the cringe compilation! 📼",
    "Certified nocoiner moment! 🤡",
    "Peak FUD achieved! 📉"
  ],
  down: [
    "Based! This one aged like milk! 🥛",
    "Absolutely rekt! 💥",
    "Another one for the meme collection! 🎯",
    "Satoshi is laughing somewhere! 😂",
    "This take didn't survive the timeline! ⏰"
  ]
};

const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('storage.cloud.google.com')) {
    const bucket = 'btcp_bucket';
    const path = url.split('/Media/')[1];
    if (path) {
      return `https://storage.googleapis.com/${bucket}/Media/${path}`;
    }
  }
  return url;
};

export default function TakeCard({ take, onVote, showShareButton = false }: TakeCardProps) {
  const { toast } = useToast();
  const [votes, setVotes] = useState(take.votes || 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();

  const getRandomMessage = (type: 'up' | 'down') => {
    const messages = VOTE_MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleVote = (increment: number) => {
    const newVotes = votes + increment;
    setVotes(newVotes);
    onVote?.(newVotes);

    toast({
      title: increment > 0 ? "Ultra Cringe!" : "Based!",
      description: getRandomMessage(increment > 0 ? 'up' : 'down'),
      duration: 2000,
    });
  };

  const handleShare = () => {
    const text = `Check out this terrible Bitcoin take from ${take.outlet}:\n\n"${take.headline}"\n\n`;
    const url = `${window.location.origin}/${take.slug}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const mediaUrl = getMediaUrl(take.media || '');
  const isVideo = mediaUrl.toLowerCase().endsWith('.mp4');
  const isDetailPage = location.pathname === `/${take.slug}`;

  return (
    <Card 
      className={cn(
        "w-full max-w-3xl mx-auto transform transition-all duration-300",
        isHovered && "scale-[1.02] shadow-xl shadow-orange-500/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          {!isDetailPage ? (
            <Link 
              to={`/${take.slug}`}
              className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition-colors"
            >
              <span>{format(new Date(take.date), 'MMM d, yyyy')}</span>
              <span className="hidden sm:inline">•</span>
              <span>{take.outlet}</span>
            </Link>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{format(new Date(take.date), 'MMM d, yyyy')}</span>
              <span className="hidden sm:inline">•</span>
              <span>{take.outlet}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {(showShareButton || !isDetailPage) && (
              <Button 
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="group hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 transition-all duration-300"
              >
                <XIcon />
                <span className="ml-2 hidden sm:inline">Share</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 group" 
              asChild
            >
              <a 
                href={take.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-orange-500 transition-all duration-300"
              >
                <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-125 group-hover:rotate-12" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        {mediaUrl && (
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video group transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
            {isVideo ? (
              <>
                <video
                  ref={videoRef}
                  key={mediaUrl}
                  src={mediaUrl}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isMuted ? 'Unmute video' : 'Mute video'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <img
                src={mediaUrl}
                alt={take.headline}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 border border-orange-500/10 hover:border-orange-500/20 transition-all duration-300">
            <p className="text-base sm:text-lg italic">{take.description}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 p-4 sm:p-6 pt-4">
        <Button
          variant="default"
          size="lg"
          onClick={() => handleVote(1)}
          className={cn(
            "flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-300",
            "hover:scale-105 hover:shadow-lg hover:shadow-red-500/20",
            "active:scale-95"
          )}
        >
          <ThumbsDown className="w-5 h-5 mr-2 animate-bounce" />
          <div className="flex gap-1">
            <span>Maximum</span>
            <span>Cringe</span>
          </div>
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => handleVote(-1)}
          className={cn(
            "flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-300",
            "hover:scale-105 hover:shadow-lg hover:shadow-green-500/20",
            "active:scale-95"
          )}
        >
          <ThumbsUp className="w-5 h-5 mr-2 animate-bounce" />
          <div className="flex gap-1">
            <span>Actually</span>
            <span>Based</span>
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
}