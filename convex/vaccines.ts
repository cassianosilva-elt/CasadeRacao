import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVaccinesForPet = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    // Check pet ownership
    const pet = await ctx.db.get(args.petId);
    if (!pet || pet.ownerId !== userId) return [];

    return await ctx.db
      .query("vaccines")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .order("asc")
      .collect();
  },
});

export const addVaccine = mutation({
  args: {
    petId: v.id("pets"),
    name: v.string(),
    dateGiven: v.number(),
    nextDueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const pet = await ctx.db.get(args.petId);
    if (!pet || pet.ownerId !== userId) throw new Error("Unauthorized");

    return await ctx.db.insert("vaccines", {
      petId: args.petId,
      name: args.name,
      dateGiven: args.dateGiven,
      nextDueDate: args.nextDueDate
    });
  },
});

export const deleteVaccine = mutation({
  args: { vaccineId: v.id("vaccines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const vaccine = await ctx.db.get(args.vaccineId);
    if (!vaccine) return;
    
    const pet = await ctx.db.get(vaccine.petId);
    if (!pet || pet.ownerId !== userId) throw new Error("Unauthorized");
    
    await ctx.db.delete(args.vaccineId);
  }
});
