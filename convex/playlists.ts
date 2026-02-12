import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserPlaylists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const playlists = await ctx.db
      .query("playlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get track count for each playlist
    const playlistsWithCount = await Promise.all(
      playlists.map(async (playlist) => {
        const tracks = await ctx.db
          .query("playlistTracks")
          .withIndex("by_playlist", (q) => q.eq("playlistId", playlist._id))
          .collect();
        return { ...playlist, trackCount: tracks.length };
      })
    );

    return playlistsWithCount;
  },
});

export const getPlaylistTracks = query({
  args: { playlistId: v.id("playlists") },
  handler: async (ctx, args) => {
    const playlistTracks = await ctx.db
      .query("playlistTracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    const sortedTracks = playlistTracks.sort((a, b) => a.position - b.position);

    const tracks = await Promise.all(
      sortedTracks.map(async (pt) => {
        const track = await ctx.db.get(pt.trackId);
        return track ? { ...track, position: pt.position } : null;
      })
    );

    return tracks.filter(Boolean);
  },
});

export const create = mutation({
  args: { name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("playlists", {
      userId,
      name: args.name,
      description: args.description,
      isPublic: false,
      createdAt: Date.now(),
    });
  },
});

export const addTrack = mutation({
  args: { playlistId: v.id("playlists"), trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }

    const existing = await ctx.db
      .query("playlistTracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    const alreadyAdded = existing.find((pt) => pt.trackId === args.trackId);
    if (alreadyAdded) return alreadyAdded._id;

    return await ctx.db.insert("playlistTracks", {
      playlistId: args.playlistId,
      trackId: args.trackId,
      position: existing.length,
      addedAt: Date.now(),
    });
  },
});

export const removeTrack = mutation({
  args: { playlistId: v.id("playlists"), trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }

    const playlistTracks = await ctx.db
      .query("playlistTracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    const toRemove = playlistTracks.find((pt) => pt.trackId === args.trackId);
    if (toRemove) {
      await ctx.db.delete(toRemove._id);
    }
  },
});

export const deletePlaylist = mutation({
  args: { playlistId: v.id("playlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Playlist not found");
    }

    // Delete all playlist tracks
    const playlistTracks = await ctx.db
      .query("playlistTracks")
      .withIndex("by_playlist", (q) => q.eq("playlistId", args.playlistId))
      .collect();

    for (const pt of playlistTracks) {
      await ctx.db.delete(pt._id);
    }

    await ctx.db.delete(args.playlistId);
  },
});
