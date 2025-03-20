import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credits: v.number(),
    subscriptionId: v.optional(v.string()), // Optional, so users may not have it initially
    subscriptionStatus: v.boolean(),
  }).index("by_email", ["email"]), 

  Discussion: defineTable({
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
    conversation: v.optional(v.any())
  })
});
