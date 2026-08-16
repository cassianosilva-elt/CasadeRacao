import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    category: v.string(),
    brand: v.string(),
    images: v.array(v.string()),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    badge: v.optional(v.string()),
    oldPrice: v.optional(v.number()),
    bagSize: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("products", {
      name: args.name,
      price: args.price,
      quantity: args.quantity,
      category: args.category,
      brand: args.brand,
      images: args.images,
      image: args.image,
      video: args.video,
      description: args.description,
      rating: args.rating ?? 5,
      reviewCount: args.reviewCount ?? 0,
      badge: args.badge,
      oldPrice: args.oldPrice,
      bagSize: args.bagSize,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    category: v.string(),
    brand: v.string(),
    images: v.array(v.string()),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    badge: v.optional(v.string()),
    oldPrice: v.optional(v.number()),
    bagSize: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updatePrice = mutation({
  args: {
    id: v.id("products"),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { price: args.price });
  },
});

export const decreaseStock = mutation({
  args: {
    id: v.id("products"),
    quantityBought: v.number(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (product) {
      const newQty = Math.max(0, (product.quantity || 0) - args.quantityBought);
      await ctx.db.patch(args.id, { quantity: newQty });
    }
  },
});

export const fixCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let fixed = 0;
    for (const product of products) {
      const nameLower = product.name.toLowerCase();
      // If the name contains "gato" or "gatos" but the category is for dogs, fix it
      if (
        (nameLower.includes("gato") || nameLower.includes("gatos")) &&
        product.category === "Rações para Cães"
      ) {
        await ctx.db.patch(product._id, { category: "Rações para Gatos" });
        fixed++;
      }
    }
    return { fixed };
  },
});

export const seedDefaults = mutation({
  args: {
    initialProducts: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        category: v.string(),
        brand: v.string(),
        images: v.array(v.string()),
        image: v.optional(v.string()),
        video: v.optional(v.string()),
        description: v.optional(v.string()),
        rating: v.optional(v.number()),
        reviewCount: v.optional(v.number()),
        badge: v.optional(v.string()),
        oldPrice: v.optional(v.number()),
        bagSize: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length === 0) {
      for (const p of args.initialProducts) {
        await ctx.db.insert("products", p);
      }
      return { seeded: args.initialProducts.length };
    }
    return { seeded: 0 };
  },
});
