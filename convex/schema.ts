import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with preferences
  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Music tracks
  tracks: defineTable({
    title: v.string(),
    artist: v.string(),
    album: v.string(),
    albumArt: v.string(),
    duration: v.number(), // in seconds
    genre: v.string(),
    plays: v.number(),
    createdAt: v.number(),
  }).index("by_genre", ["genre"])
    .index("by_artist", ["artist"])
    .index("by_plays", ["plays"]),

  // User's library (saved tracks)
  library: defineTable({
    userId: v.id("users"),
    trackId: v.id("tracks"),
    addedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_track", ["userId", "trackId"]),

  // Playlists
  playlists: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    coverArt: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Playlist tracks (many-to-many)
  playlistTracks: defineTable({
    playlistId: v.id("playlists"),
    trackId: v.id("tracks"),
    position: v.number(),
    addedAt: v.number(),
  }).index("by_playlist", ["playlistId"])
    .index("by_track", ["trackId"]),

  // Recently played
  recentlyPlayed: defineTable({
    userId: v.id("users"),
    trackId: v.id("tracks"),
    playedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_recent", ["userId", "playedAt"]),

  // Current playback state
  playbackState: defineTable({
    userId: v.id("users"),
    currentTrackId: v.optional(v.id("tracks")),
    isPlaying: v.boolean(),
    progress: v.number(), // in seconds
    volume: v.number(),
    shuffle: v.boolean(),
    repeat: v.string(), // "off" | "all" | "one"
    queueTrackIds: v.array(v.id("tracks")),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
