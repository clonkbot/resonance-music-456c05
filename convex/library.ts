import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const libraryItems = await ctx.db
      .query("library")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const tracks = await Promise.all(
      libraryItems.map(async (item) => {
        const track = await ctx.db.get(item.trackId);
        return track ? { ...track, addedAt: item.addedAt, libraryId: item._id } : null;
      })
    );

    return tracks.filter(Boolean);
  },
});

export const isInLibrary = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const existing = await ctx.db
      .query("library")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .first();

    return !!existing;
  },
});

export const add = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("library")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("library", {
      userId,
      trackId: args.trackId,
      addedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("library")
      .withIndex("by_user_and_track", (q) =>
        q.eq("userId", userId).eq("trackId", args.trackId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
