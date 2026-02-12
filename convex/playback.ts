import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!state) return null;

    // Get current track details
    let currentTrack = null;
    if (state.currentTrackId) {
      currentTrack = await ctx.db.get(state.currentTrackId);
    }

    // Get queue tracks
    const queueTracks = await Promise.all(
      state.queueTrackIds.map((id) => ctx.db.get(id))
    );

    return {
      ...state,
      currentTrack,
      queue: queueTracks.filter(Boolean),
    };
  },
});

export const play = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // Record in recently played
    await ctx.db.insert("recentlyPlayed", {
      userId,
      trackId: args.trackId,
      playedAt: Date.now(),
    });

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentTrackId: args.trackId,
        isPlaying: true,
        progress: 0,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("playbackState", {
      userId,
      currentTrackId: args.trackId,
      isPlaying: true,
      progress: 0,
      volume: 80,
      shuffle: false,
      repeat: "off",
      queueTrackIds: [],
      updatedAt: Date.now(),
    });
  },
});

export const pause = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      await ctx.db.patch(state._id, {
        isPlaying: false,
        updatedAt: Date.now(),
      });
    }
  },
});

export const resume = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      await ctx.db.patch(state._id, {
        isPlaying: true,
        updatedAt: Date.now(),
      });
    }
  },
});

export const setVolume = mutation({
  args: { volume: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      await ctx.db.patch(state._id, {
        volume: args.volume,
        updatedAt: Date.now(),
      });
    }
  },
});

export const toggleShuffle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      await ctx.db.patch(state._id, {
        shuffle: !state.shuffle,
        updatedAt: Date.now(),
      });
    }
  },
});

export const cycleRepeat = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      const nextRepeat =
        state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off";
      await ctx.db.patch(state._id, {
        repeat: nextRepeat,
        updatedAt: Date.now(),
      });
    }
  },
});

export const addToQueue = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const state = await ctx.db
      .query("playbackState")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (state) {
      await ctx.db.patch(state._id, {
        queueTrackIds: [...state.queueTrackIds, args.trackId],
        updatedAt: Date.now(),
      });
    }
  },
});

export const getRecentlyPlayed = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const recent = await ctx.db
      .query("recentlyPlayed")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);

    // Deduplicate by track and get track details
    const seen = new Set<string>();
    const tracks = [];

    for (const r of recent) {
      if (!seen.has(r.trackId)) {
        seen.add(r.trackId);
        const track = await ctx.db.get(r.trackId);
        if (track) {
          tracks.push({ ...track, playedAt: r.playedAt });
        }
      }
    }

    return tracks.slice(0, 8);
  },
});
