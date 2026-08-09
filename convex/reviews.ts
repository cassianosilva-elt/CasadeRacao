import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getReviewsByProduct = query({
  args: { productId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

export const addReview = mutation({
  args: {
    productId: v.string(),
    rating: v.number(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Não autenticado para avaliar");
    }

    const user = await ctx.db.get(userId);
    
    return await ctx.db.insert("reviews", {
      productId: args.productId,
      userId: userId,
      rating: args.rating,
      text: args.text,
      userName: user?.name || "Cliente LOPES",
    });
  },
});

export const listAllReviews = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");

    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const deleteReviewAdmin = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) throw new Error("Unauthorized");

    await ctx.db.delete(args.reviewId);
  },
});
