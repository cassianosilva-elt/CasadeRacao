import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listMySubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createSubscription = mutation({
  args: {
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      brand: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.string()
    })),
    frequency: v.string(), // "monthly" | "biweekly"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const daysToAdd = args.frequency === "monthly" ? 30 : 15;
    const nextDeliveryTimestamp = new Date().getTime() + (daysToAdd * 24 * 60 * 60 * 1000);

    return await ctx.db.insert("subscriptions", {
      userId,
      items: args.items,
      frequency: args.frequency,
      status: "active",
      nextDeliveryDate: nextDeliveryTimestamp
    });
  },
});

export const cancelSubscription = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const sub = await ctx.db.get(args.subscriptionId);
    if (!sub || sub.userId !== userId) throw new Error("Unauthorized");
    
    await ctx.db.patch(args.subscriptionId, { status: "cancelled" });
  }
});

export const listAllSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");

    return await ctx.db.query("subscriptions").order("desc").collect();
  },
});

export const cancelSubscriptionAdmin = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");

    await ctx.db.patch(args.subscriptionId, { status: "cancelled" });
  },
});
