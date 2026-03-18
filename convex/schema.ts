import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    onboardingComplete: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
  }).index("email", ["email"]),
  
  pets: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    species: v.string(), // "cão", "gato", etc.
    breed: v.string(),
    age: v.string(),
  }).index("by_owner", ["ownerId"]),

  orders: defineTable({
    userId: v.optional(v.id("users")), // If logged in
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
    status: v.string(), // "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled"
  }).index("by_user", ["userId"]),
});

export default schema;
