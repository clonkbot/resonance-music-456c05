import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Seed data for demo tracks
const DEMO_TRACKS = [
  { title: "Midnight Dreams", artist: "Luna Waves", album: "Nocturnal", albumArt: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop", duration: 234, genre: "Electronic", plays: 2450000 },
  { title: "Golden Hour", artist: "Solar Flare", album: "Daylight", albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop", duration: 198, genre: "Pop", plays: 5200000 },
  { title: "Neon Lights", artist: "Synthwave Collective", album: "Retro Future", albumArt: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop", duration: 267, genre: "Synthwave", plays: 1800000 },
  { title: "Ocean Breeze", artist: "Coastal Sound", album: "Tides", albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", duration: 312, genre: "Ambient", plays: 980000 },
  { title: "Urban Jungle", artist: "Metro Beats", album: "City Life", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", duration: 245, genre: "Hip Hop", plays: 3400000 },
  { title: "Starlight Symphony", artist: "Celestial Orchestra", album: "Cosmos", albumArt: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=300&fit=crop", duration: 289, genre: "Classical", plays: 720000 },
  { title: "Electric Soul", artist: "Volt", album: "Charged", albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop", duration: 223, genre: "R&B", plays: 4100000 },
  { title: "Desert Wind", artist: "Nomad", album: "Wanderer", albumArt: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop", duration: 276, genre: "World", plays: 560000 },
  { title: "Velocity", artist: "Hyperdrive", album: "Fast Lane", albumArt: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop", duration: 198, genre: "EDM", plays: 6700000 },
  { title: "Whisper", artist: "Silence Theory", album: "Hush", albumArt: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&h=300&fit=crop", duration: 342, genre: "Indie", plays: 1200000 },
  { title: "Thunder Road", artist: "Storm Riders", album: "Lightning", albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop", duration: 256, genre: "Rock", plays: 2900000 },
  { title: "Crystal Clear", artist: "Pure Tone", album: "Clarity", albumArt: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop", duration: 301, genre: "Pop", plays: 3800000 },
];

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tracks").order("desc").collect();
  },
});

export const getPopular = query({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    return tracks.sort((a, b) => b.plays - a.plays).slice(0, 10);
  },
});

export const getByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tracks")
      .withIndex("by_genre", (q) => q.eq("genre", args.genre))
      .collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const tracks = await ctx.db.query("tracks").collect();
    const q = args.query.toLowerCase();
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  },
});

export const getGenres = query({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    const genres = [...new Set(tracks.map((t) => t.genre))];
    return genres;
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tracks").first();
    if (existing) return { seeded: false, message: "Tracks already exist" };

    for (const track of DEMO_TRACKS) {
      await ctx.db.insert("tracks", {
        ...track,
        createdAt: Date.now(),
      });
    }

    return { seeded: true, message: `Seeded ${DEMO_TRACKS.length} tracks` };
  },
});

export const incrementPlays = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const track = await ctx.db.get(args.trackId);
    if (!track) throw new Error("Track not found");
    await ctx.db.patch(args.trackId, { plays: track.plays + 1 });
  },
});
