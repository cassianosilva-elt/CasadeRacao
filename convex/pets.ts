import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listMyPets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
    return await ctx.db
      .query("pets")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
  },
});

export const addPet = mutation({
  args: {
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    age: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db.insert("pets", {
      ownerId: userId,
      ...args,
    });
  },
});

export const deletePet = mutation({
  args: {
    petId: v.id("pets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const pet = await ctx.db.get(args.petId);
    if (!pet || pet.ownerId !== userId) {
      throw new Error("Pet not found or unauthorized");
    }
    await ctx.db.delete(args.petId);
  },
});
