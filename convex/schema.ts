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
    petCoins: v.optional(v.number()),
    referralCode: v.optional(v.string()),
    referredBy: v.optional(v.id("users")),
  }).index("email", ["email"]).index("by_referralCode", ["referralCode"]),
  
  pets: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    species: v.string(), // "cão", "gato", etc.
    breed: v.string(),
    age: v.string(),
    weight: v.optional(v.number()), // in kg
    photo: v.optional(v.string()),
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
      image: v.string(),
      isSubscription: v.optional(v.boolean())
    })),
    paymentMethod: v.string(), // "pix" | "card" | "boleto"
    coupon: v.optional(v.string()),
    subtotal: v.number(),
    shippingFee: v.optional(v.number()),
    discount: v.number(),
    total: v.number(),
    usedPetCoins: v.optional(v.number()),
    status: v.string(), // "pending" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled"
  }).index("by_user", ["userId"]),
  
  reviews: defineTable({
    productId: v.string(),
    userId: v.id("users"),
    rating: v.number(),
    text: v.string(),
    userName: v.string(),
  }).index("by_product", ["productId"]).index("by_user", ["userId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      brand: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.string()
    })),
    status: v.string(), // "active" | "cancelled" | "paused"
    frequency: v.string(), // "monthly" | "biweekly"
    nextDeliveryDate: v.number(), // timestamp
  }).index("by_user", ["userId"]),
  
  vaccines: defineTable({
    petId: v.id("pets"),
    name: v.string(),
    dateGiven: v.number(), // timestamp
    nextDueDate: v.number(), // timestamp
  }).index("by_pet", ["petId"]),
});

export default schema;
