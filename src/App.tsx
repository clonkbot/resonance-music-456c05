import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Auth Component
function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-rose-900/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-900/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 mb-6 shadow-2xl shadow-purple-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            Resonance
          </h1>
          <p className="text-zinc-500 mt-3 text-lg">Feel the music differently</p>
        </div>

        {/* Auth Form */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-rose-400 text-sm bg-rose-500/10 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </span>
              ) : flow === "signIn" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900/50 text-zinc-500">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full py-4 bg-zinc-800/50 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 transition-all border border-zinc-700/50"
          >
            Continue as Guest
          </button>

          <p className="text-center mt-6 text-zinc-500">
            {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {flow === "signIn" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Track type
interface Track {
  _id: Id<"tracks">;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  genre: string;
  plays: number;
}

// Format duration
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Format plays
function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
  return plays.toString();
}

// Track Card Component
function TrackCard({ track, isPlaying, onPlay }: { track: Track; isPlaying: boolean; onPlay: () => void }) {
  const addToLibrary = useMutation(api.library.add);
  const removeFromLibrary = useMutation(api.library.remove);
  const isInLibrary = useQuery(api.library.isInLibrary, { trackId: track._id });

  const toggleLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInLibrary) {
      await removeFromLibrary({ trackId: track._id });
    } else {
      await addToLibrary({ trackId: track._id });
    }
  };

  return (
    <div
      onClick={onPlay}
      className={`group relative bg-zinc-900/30 hover:bg-zinc-800/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 border border-transparent hover:border-zinc-700/50 ${isPlaying ? "ring-2 ring-purple-500/50 bg-purple-900/20" : ""}`}
    >
      <div className="relative mb-4">
        <img
          src={track.albumArt}
          alt={track.album}
          className="w-full aspect-square object-cover rounded-xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform ${isPlaying ? "bg-purple-500 scale-100" : "bg-white scale-90 group-hover:scale-100"}`}>
            {isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
        <button
          onClick={toggleLibrary}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInLibrary ? "bg-purple-500 text-white" : "bg-black/50 text-white opacity-0 group-hover:opacity-100"}`}
        >
          <svg className="w-4 h-4" fill={isInLibrary ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <h3 className="font-semibold text-white truncate">{track.title}</h3>
      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
      <p className="text-xs text-zinc-500 mt-1">{formatPlays(track.plays)} plays</p>
    </div>
  );
}

// Track Row Component
function TrackRow({ track, index, isPlaying, onPlay }: { track: Track; index: number; isPlaying: boolean; onPlay: () => void }) {
  const addToLibrary = useMutation(api.library.add);
  const removeFromLibrary = useMutation(api.library.remove);
  const isInLibrary = useQuery(api.library.isInLibrary, { trackId: track._id });

  const toggleLibrary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInLibrary) {
      await removeFromLibrary({ trackId: track._id });
    } else {
      await addToLibrary({ trackId: track._id });
    }
  };

  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${isPlaying ? "bg-purple-900/30 border border-purple-500/30" : "hover:bg-zinc-800/50"}`}
    >
      <span className="w-6 text-center text-sm text-zinc-500 group-hover:hidden">
        {index + 1}
      </span>
      <div className="w-6 hidden group-hover:flex items-center justify-center">
        {isPlaying ? (
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
      <img src={track.albumArt} alt={track.album} className="w-12 h-12 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium truncate ${isPlaying ? "text-purple-400" : "text-white"}`}>{track.title}</h4>
        <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
      </div>
      <span className="text-sm text-zinc-500 hidden sm:block">{track.album}</span>
      <button
        onClick={toggleLibrary}
        className={`p-2 rounded-full transition-all ${isInLibrary ? "text-purple-400" : "text-zinc-500 opacity-0 group-hover:opacity-100"}`}
      >
        <svg className="w-5 h-5" fill={isInLibrary ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      <span className="text-sm text-zinc-500 w-12 text-right">{formatDuration(track.duration)}</span>
    </div>
  );
}

// Player Bar Component
function PlayerBar({ track, isPlaying, onPlayPause }: { track: Track | null; isPlaying: boolean; onPlayPause: () => void }) {
  const [progress, setProgress] = useState(0);
  const playbackState = useQuery(api.playback.getState);
  const setVolume = useMutation(api.playback.setVolume);
  const toggleShuffle = useMutation(api.playback.toggleShuffle);
  const cycleRepeat = useMutation(api.playback.cycleRepeat);

  useEffect(() => {
    if (isPlaying && track) {
      const interval = setInterval(() => {
        setProgress((p) => (p >= track.duration ? 0 : p + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, track]);

  useEffect(() => {
    setProgress(0);
  }, [track?._id]);

  if (!track) return null;

  const progressPercent = (progress / track.duration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 px-4 py-3 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img src={track.albumArt} alt={track.album} className="w-14 h-14 rounded-lg object-cover shadow-lg" />
          <div className="min-w-0">
            <h4 className="font-medium text-white truncate">{track.title}</h4>
            <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleShuffle()}
              className={`p-2 rounded-full transition-colors hidden sm:block ${playbackState?.shuffle ? "text-purple-400" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={onPlayPause}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <button
              onClick={() => cycleRepeat()}
              className={`p-2 rounded-full transition-colors hidden sm:block ${playbackState?.repeat !== "off" ? "text-purple-400" : "text-zinc-400 hover:text-white"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {playbackState?.repeat === "one" && <span className="absolute text-xs">1</span>}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-zinc-500 w-10 text-right">{formatDuration(progress)}</span>
            <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 w-10">{formatDuration(track.duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={playbackState?.volume ?? 80}
            onChange={(e) => setVolume({ volume: parseInt(e.target.value) })}
            className="w-24 h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer hidden sm:block [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MusicApp() {
  const { signOut } = useAuthActions();
  const [view, setView] = useState<"home" | "library" | "search">("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const tracks = useQuery(api.tracks.getAll);
  const popularTracks = useQuery(api.tracks.getPopular);
  const recentlyPlayed = useQuery(api.playback.getRecentlyPlayed);
  const library = useQuery(api.library.get);
  const searchResults = useQuery(api.tracks.search, searchQuery ? { query: searchQuery } : "skip");
  const genres = useQuery(api.tracks.getGenres);
  const playbackState = useQuery(api.playback.getState);

  const seedTracks = useMutation(api.tracks.seed);
  const playTrack = useMutation(api.playback.play);
  const pauseTrack = useMutation(api.playback.pause);
  const resumeTrack = useMutation(api.playback.resume);

  // Seed tracks on mount
  useEffect(() => {
    seedTracks();
  }, []);

  // Sync current track with playback state
  useEffect(() => {
    if (playbackState?.currentTrack) {
      setCurrentTrack(playbackState.currentTrack as Track);
    }
  }, [playbackState?.currentTrack]);

  const handlePlay = async (track: Track) => {
    setCurrentTrack(track);
    await playTrack({ trackId: track._id });
  };

  const handlePlayPause = async () => {
    if (playbackState?.isPlaying) {
      await pauseTrack();
    } else {
      await resumeTrack();
    }
  };

  const isPlaying = playbackState?.isPlaying ?? false;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-bold hidden sm:block">Resonance</h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tracks, artists, albums..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setView("search");
                  else setView("home");
                }}
                className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Navigation */}
        <div className="max-w-screen-xl mx-auto px-4 pb-4">
          <nav className="flex gap-1 sm:gap-2">
            {[
              { id: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "library", label: "Library", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as "home" | "library");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm sm:text-base ${view === item.id ? "bg-white text-black font-medium" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Search Results */}
        {view === "search" && searchQuery && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Results for "{searchQuery}"</h2>
            {searchResults && searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((track: Track, i: number) => (
                  <TrackRow
                    key={track._id}
                    track={track}
                    index={i}
                    isPlaying={currentTrack?._id === track._id && isPlaying}
                    onPlay={() => handlePlay(track)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-zinc-500">No results found</p>
            )}
          </div>
        )}

        {/* Library View */}
        {view === "library" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Your Library</h2>
              <span className="text-zinc-500">{library?.length ?? 0} tracks</span>
            </div>
            {library && library.length > 0 ? (
              <div className="space-y-2">
                {(library as Track[]).map((track, i) => (
                  <TrackRow
                    key={track._id}
                    track={track}
                    index={i}
                    isPlaying={currentTrack?._id === track._id && isPlaying}
                    onPlay={() => handlePlay(track)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
                <p className="text-zinc-500">Save tracks by clicking the heart icon</p>
              </div>
            )}
          </div>
        )}

        {/* Home View */}
        {view === "home" && !searchQuery && (
          <div className="space-y-10">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/50 via-rose-900/30 to-cyan-900/30 p-6 sm:p-10">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80')] bg-cover bg-center opacity-20" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-full text-sm mb-4">Featured</span>
                <h2 className="text-3xl sm:text-5xl font-display font-bold mb-3">Discover New Sounds</h2>
                <p className="text-zinc-300 mb-6 max-w-lg text-sm sm:text-base">Explore curated playlists and fresh releases that match your unique taste.</p>
                <button
                  onClick={() => tracks && tracks.length > 0 && handlePlay(tracks[Math.floor(Math.random() * tracks.length)])}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Random
                </button>
              </div>
            </section>

            {/* Recently Played */}
            {recentlyPlayed && recentlyPlayed.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Recently Played</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {(recentlyPlayed as Track[]).slice(0, 5).map((track) => (
                    <TrackCard
                      key={track._id}
                      track={track}
                      isPlaying={currentTrack?._id === track._id && isPlaying}
                      onPlay={() => handlePlay(track)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Popular Tracks */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Popular Right Now</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {popularTracks?.slice(0, 5).map((track: Track) => (
                  <TrackCard
                    key={track._id}
                    track={track}
                    isPlaying={currentTrack?._id === track._id && isPlaying}
                    onPlay={() => handlePlay(track)}
                  />
                ))}
              </div>
            </section>

            {/* Browse by Genre */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Browse by Genre</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {genres?.map((genre: string, i: number) => {
                  const colors = [
                    "from-rose-500 to-orange-500",
                    "from-purple-500 to-pink-500",
                    "from-cyan-500 to-blue-500",
                    "from-green-500 to-emerald-500",
                    "from-amber-500 to-yellow-500",
                    "from-indigo-500 to-violet-500",
                  ];
                  return (
                    <button
                      key={genre}
                      className={`relative h-24 sm:h-32 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <span className="absolute bottom-3 left-3 font-bold text-base sm:text-lg">{genre}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* All Tracks */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Tracks</h2>
              <div className="space-y-2">
                {tracks?.map((track: Track, i: number) => (
                  <TrackRow
                    key={track._id}
                    track={track}
                    index={i}
                    isPlaying={currentTrack?._id === track._id && isPlaying}
                    onPlay={() => handlePlay(track)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-screen-xl mx-auto px-4 py-8 mt-12 text-center">
        <p className="text-xs text-zinc-600">
          Requested by{" "}
          <a href="https://twitter.com/0xPaulius" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
            @0xPaulius
          </a>
          {" "}·{" "}Built by{" "}
          <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">
            @clonkbot
          </a>
        </p>
      </footer>

      {/* Player Bar */}
      <PlayerBar track={currentTrack} isPlaying={isPlaying} onPlayPause={handlePlayPause} />
    </div>
  );
}

// Root App with Auth
export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <MusicApp />;
}
