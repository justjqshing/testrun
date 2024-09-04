'use server'

import Comment from "@/database/models/comment.model";
import { connectToDatabase } from "@/database"
import { GetidByclerk } from "./user.actions";
import User from "@/database/models/user.model";
export async function CreateComment({UserId, comment, prompt}:any) {
    try {
        await connectToDatabase();
        const user = await GetidByclerk(UserId)
        const Creator = user[0]._id
        const commentBuilder = await Comment.create({Creator, comment, subComments: [], prompt})
        return {
            data :JSON.parse(JSON.stringify(commentBuilder)),
            id: JSON.parse(JSON.stringify(commentBuilder._id))
        }
    } catch (error) {
        console.log(error)
    }
}
export async function GetcommentbyId(id: any) {
    try {
        await connectToDatabase();
        const comment = await Comment.findById(id)
        return JSON.parse(JSON.stringify(comment)).populate({ path: 'Creator', model: User, select: '_id firstName lastName username Image' })
    } catch (error) {
        console.log(error)
    }
}
export async function CreateSubComment({Parentcomment, Subcomment}:any) {
    try {
        console.log(Parentcomment, Subcomment)
        
        await connectToDatabase();
        const SubComment = await Comment.findByIdAndUpdate(Parentcomment, {$push: {subComments: Subcomment}})
        console.log(SubComment)
        return JSON.parse(JSON.stringify(SubComment))
    } catch (error) {
        console.log(error)
    }
}
export async function LikeComment({CommentID, userId}: any) {
    try {
        await connectToDatabase();
        console.log(CommentID, userId)
        const prompt = await Comment.findById(CommentID);
        console.log(prompt)
        if (!prompt.likedBy.includes(userId)) {
          const like = await Comment.findByIdAndUpdate(CommentID, { $inc: { likes: 1 }, $push: { likedBy: userId } });
          return JSON.parse(JSON.stringify(like));
        }
    } catch (error) {
        console.log(error)
    }
   
    
  
  }
  export async function DislikeComment({CommentID, userId}: any) {
    await connectToDatabase();
    const prompt = await Comment.findById(CommentID);
    if (!prompt.dislikedBy.includes(userId)) {
      const like = await Comment.findByIdAndUpdate(CommentID, { $inc: { dislikes: 1 }, $push: { dislikedBy: userId } });
      return JSON.parse(JSON.stringify(like));
    }
  }