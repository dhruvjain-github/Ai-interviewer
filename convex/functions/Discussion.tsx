import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const CreateDiscussion = mutation({
  args: { 
    coachingOption: v.string(),
    topic: v.string(),
    expertName: v.string(),
    uid:v.id('users')
},
  handler: async (ctx, args) => {
    const result= await ctx.db.insert("Discussion", {
    coachingOption: args.coachingOption,
      topic: args.topic,
      expertName: args.expertName,
      uid:args.uid
    });
    return result;
  },
});

export const GetDiscussion = query({
  args: {
    id: v.id('Discussion'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.id);
    return result;
  }
});


export const UpdateConversation = mutation({
  args:{
    id:v.id('Discussion'),
    conversation:v.any()
  },
  handler:async(ctx,args)=>{
    await ctx.db.patch(args.id,{
      conversation:args.conversation
    })
  }
})

export const UpdateSummery = mutation({
  args:{
    id:v.id('Discussion'),
    summery:v.any()
  },
  handler:async(ctx,args)=>{
    await ctx.db.patch(args.id,{
      summery:args.summery
    })
  }
})


export const GetAllDiscussion = query({
  args: {
    uid: v.id('users'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.query('Discussion').filter(q=>q.eq(q.field('uid'),args.uid)).order('desc').collect();
    return result;
  }
});