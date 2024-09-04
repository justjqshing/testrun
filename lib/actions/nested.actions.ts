'use server';
import Nested from "@/database/models/nestedComment.model";
import { connectToDatabase } from "@/database";
import User from "@/database/models/user.model";
import { GetidByclerk } from "@/lib/actions/user.actions";

export async function createNestedComment(comment: string, parentComment: string, mainComment: string, userId: any, prompt: any) {
    await connectToDatabase();
    const user = await GetidByclerk(userId)
    const Creator = user[0]._id
    const nestedComment = await Nested.create({ comment, parentComment, mainComment, Creator, prompt });
    return JSON.parse(JSON.stringify(nestedComment));
}

export async function GetallNestedComments() {
    try {
        await connectToDatabase();
        const nestedComment = await Nested.find().populate({ path: 'Creator', model: User, select: '_id firstName lastName username Image' })
        return JSON.parse(JSON.stringify(nestedComment));
    } catch (error) {
        console.log(error);
    }
}
export async function LikeNestedComment({CommentID, userId}: any) {
    try {
        await connectToDatabase();
        const prompt = await Nested.findById(CommentID);
        const User = await GetidByclerk(userId)
        if (!prompt.likedBy.includes(User[0]._id)) {
          const like = await Nested.findByIdAndUpdate(CommentID, { $inc: { likes: 1 }, $push: { likedBy: User[0]._id } });
          return JSON.parse(JSON.stringify(like));
        }
    } catch (error) {
        console.log(error)
    }
   
    
  
  }
  export async function UnLikeNestedComment({CommentID, userId}: any) {
    try {
        await connectToDatabase();
        const prompt = await Nested.findById(CommentID);
        const User = await GetidByclerk(userId)
        console.log(prompt.likedBy)
        if (prompt.likedBy.includes(User[0]._id)) {
          const like = await Nested.findByIdAndUpdate(CommentID, { $inc: { likes: -1 }, $pull: { likedBy: User[0]._id } });
          return JSON.parse(JSON.stringify(like));
        }
    } catch (error) {
        console.log(error)
    }
   
    
  
  }