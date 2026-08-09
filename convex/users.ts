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

export const generateReferralCode = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (user?.referralCode) return user.referralCode;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await ctx.db.patch(userId, { referralCode: code });
    return code;
  }
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, args);
  },
});

export const addPetCoins = mutation({
  args: { amount: v.number(), reason: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    const currentCoins = user?.petCoins || 0;
    await ctx.db.patch(userId, { petCoins: currentCoins + args.amount });
  }
});

export const spendPetCoins = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    const currentCoins = user?.petCoins || 0;
    if (currentCoins < args.amount) throw new Error("Saldo insuficiente de PetCoins");
    await ctx.db.patch(userId, { petCoins: currentCoins - args.amount });
  }
});

export const applyReferralCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (user?.referredBy) throw new Error("Você já foi indicado anteriormente");

    const referrer = await ctx.db
      .query("users")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", args.code.toUpperCase()))
      .unique();

    if (!referrer) throw new Error("Código de indicação inválido");
    if (referrer._id === userId) throw new Error("Você não pode indicar a si mesmo");

    // Bonus for both
    await ctx.db.patch(userId, { 
      referredBy: referrer._id,
      petCoins: (user?.petCoins || 0) + 10 // 10 coins for the new user
    });

    await ctx.db.patch(referrer._id, {
      petCoins: (referrer.petCoins || 0) + 50 // 50 coins for the referrer
    });

    return { referrerName: referrer.name };
  }
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

export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");

    return await ctx.db.query("users").order("desc").collect();
  },
});

export const toggleUserAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");
    
    if (userId === args.userId) throw new Error("Cannot toggle yourself");
    
    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) throw new Error("User not found");
    
    await ctx.db.patch(args.userId, { isAdmin: !targetUser.isAdmin });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");
    
    if (userId === args.userId) throw new Error("Cannot delete yourself");
    
    await ctx.db.delete(args.userId);
  },
});
