import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const CreateUser = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email)) 
      .first();

    if (existingUser) {
      return existingUser; 
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      credits: 50000,
      subscriptionId: undefined, 
      subscriptionStatus: false,
    });
  },
});
