import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const CreateDiscussion = mutation({
  args: { 
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string() 
},
  handler: async (ctx, args) => {
    const result= await ctx.db.insert("Discussion", {
    coachingOption: args.coachingOption,
      topic: args.topic,
      expertName: args.expertName,
    });
    return result;
  },
});