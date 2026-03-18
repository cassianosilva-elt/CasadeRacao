import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrder = mutation({
  args: {
    tutor: v.object({
      name: v.string(),
      whatsapp: v.string(),
      email: v.string(),
      cpf: v.string(),
    }),
    address: v.object({
      zip: v.string(),
      street: v.string(),
      number: v.string(),
      complement: v.string(),
      neighborhood: v.string(),
      city: v.string(),
      state: v.string(),
      isStorePickup: v.boolean(),
    }),
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      brand: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.string()
    })),
    paymentMethod: v.string(), // "pix" | "card" | "boleto"
    coupon: v.optional(v.string()),
    subtotal: v.number(),
    discount: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    // Default status according to payment method
    let initialStatus = "pending";
    if (args.paymentMethod === "card" || args.paymentMethod === "pix") {
      initialStatus = "paid"; // Auto simulate paid for demo
    }
    
    const orderId = await ctx.db.insert("orders", {
      userId: userId ?? undefined,
      tutor: args.tutor,
      address: args.address,
      items: args.items,
      paymentMethod: args.paymentMethod,
      coupon: args.coupon,
      subtotal: args.subtotal,
      discount: args.discount,
      total: args.total,
      status: initialStatus,
    });
    
    return orderId;
  },
});

export const listMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc") // Most recent first
      .collect();
  },
});

export const listAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const user = await ctx.db.get(userId);
    if (!user?.isAdmin) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
