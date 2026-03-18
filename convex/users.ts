import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    
    const updates: { name?: string; phone?: string; onboardingComplete?: boolean } = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    updates.onboardingComplete = true;

    await ctx.db.patch(userId, updates);
  },
});

export const isCurrentUserAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    
    const user = await ctx.db.get(userId);
    return user?.isAdmin === true;
  },
});

export const makeAdmin = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").withIndex("email", q => q.eq("email", args.email)).first();
    if (!user) {
      throw new Error(`User with email ${args.email} not found`);
    }
    
    await ctx.db.patch(user._id, { isAdmin: true });
    return `User ${args.email} is now an admin.`;
  },
});
