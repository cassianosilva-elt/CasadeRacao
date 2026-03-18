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
});

export default schema;
