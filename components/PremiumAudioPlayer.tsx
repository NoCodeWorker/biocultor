'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PremiumAudioPlayer({ 
  src, 
  title = "Escucha la explicación técnica" 
}: { 
  src: string; 
  title?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      if (audio) audio.currentTime = 0;
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-2.5 p-3.5 rounded-2xl bg-[#FAFAF9] border border-brand-green/15 shadow-sm mt-4 group">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-green/10 flex items-center justify-center">
            <Headphones className="w-3 h-3 text-brand-green" />
          </div>
          <span className="text-[11px] font-bold text-brand-brown-dark uppercase tracking-widest opacity-80">
            {title}
          </span>
        </div>
        
        {/* Animated Equalizer (Simulated) */}
        {isPlaying && (
          <div className="flex items-center gap-0.5 h-3">
            <div className="w-0.5 h-full bg-brand-green animate-[bounce_0.8s_infinite] delay-75" />
            <div className="w-0.5 h-2/3 bg-brand-green animate-[bounce_0.8s_infinite] delay-150" />
            <div className="w-0.5 h-full bg-brand-green animate-[bounce_0.8s_infinite] delay-200" />
            <div className="w-0.5 h-1/2 bg-brand-green animate-[bounce_0.8s_infinite] delay-300" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 shrink-0 rounded-full bg-brand-brown-dark hover:bg-brand-green text-cream flex items-center justify-center transition-colors shadow-md"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-brand-brown/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-brand-green [&::-webkit-slider-thumb]:rounded-full transition-all"
            style={{
              background: `linear-gradient(to right, var(--brand-green) ${(progress / (duration || 1)) * 100}%, rgba(87,53,32,0.1) ${(progress / (duration || 1)) * 100}%)`
            }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] font-medium text-brand-brown/60 font-mono">{formatTime(progress)}</span>
            <span className="text-[10px] font-medium text-brand-brown/60 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        <button 
          onClick={toggleMute}
          className="w-8 h-8 shrink-0 rounded-full hover:bg-brand-brown/5 flex items-center justify-center transition-colors text-brand-brown/60"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
