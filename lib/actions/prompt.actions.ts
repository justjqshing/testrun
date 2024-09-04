'use server'
import Search from "@/components/shared/Search"
import { connectToDatabase } from "@/database"
import Prompt from "@/database/models/prompt.model"
import User from "@/database/models/user.model"
import Comment from "@/database/models/comment.model"
import { json } from "stream/consumers"
type CreateUserParams = {
  userId?: string
  promptID?: string
  type?: string
  values: {
    title: string
    prompt: string
    description: string
  }

    
}

export async function createPrompt({values , userId}: CreateUserParams) {
    try {
      await connectToDatabase()
  
      const newPrompt = await Prompt.create({...values, organizer: userId, createdAt: new Date(), likes: 0, likedBy: [], dislikes: 0, dislikedBy: [], comments: []})
      return JSON.parse(JSON.stringify(newPrompt))
    } catch (error) {
      console.error(error)
      return
    }
  }
export async function UpdatePrompt({values, promptID}: CreateUserParams) {
  try {
    await connectToDatabase()

    const newPrompt = await Prompt.findByIdAndUpdate(promptID, values, { new: true })
    return JSON.parse(JSON.stringify(newPrompt))
  } catch (error) {
    console.error(error)
    return
  }
}
type CheckForDuplicatePromptParams = {
  data: object | string
  type?: string
  promptID?: string

}
export async function checkForDuplicatePrompt({data, type, promptID}: CheckForDuplicatePromptParams) {
    
    try {
      await connectToDatabase()
      let promptExists: boolean = false;
      if (type === 'Update') {
        const prompt = await Prompt.findById(promptID)
        if (prompt.prompt === data) {
          promptExists = true
        } else { 
          const existingPrompt = await Prompt.findOne({ prompt: data })
          console.log(JSON.stringify(existingPrompt))
          promptExists = existingPrompt ? false : true
        }
      } else {
        const existingPrompt = await Prompt.findOne({ prompt: data })
        console.log(JSON.stringify(existingPrompt))
        promptExists = existingPrompt ? false : true
      }
      return JSON.parse(JSON.stringify(promptExists))
  
    
    } catch (error) {
      console.error(error)
      return
      }
     }
export async function getPromptById(id: string) {
    try {
      await connectToDatabase()
  
      const prompt = await Prompt.findById(id)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
      .populate({ path: 'comments', model: Comment, select: '_id comment Creator', populate: { path: 'Creator', model: User, select: '_id firstName lastName username Image' } })
      
      .exec();
      return JSON.parse(JSON.stringify(prompt))
    } catch (error) {
      console.error(error)
      return
    }
  }
type SearchProps = {
  Query: string
  Tag: string
  Limit: number
  page: number
  order: any
}
export async function getAllPrompts({ Query, Tag, Limit, page, order }: SearchProps) {
  try {
    await connectToDatabase();

    if (Tag.startsWith('#')) {
      Tag = Tag.slice(1);
    }

    const titleCondition = Query ? { title: { $regex: new RegExp(Query, 'i') } } : {};
    const tagsCondition = Tag ? { tags: { $regex: new RegExp(Tag, 'i') } } : {};
    const skipAmount = (Number(page) - 1) * Limit;

    const conditions = {
      $and: [tagsCondition, titleCondition],
    };


    const [field, direction] = order.split(':');

    const sortOrder = { [field]: parseInt(direction), dislikes: field === 'likes' && direction === '-1' ? 1 : -1 };


    console.log(sortOrder)

    const Prompts = await Prompt.find(conditions)
      .populate({ path: 'organizer', model: User, select: '_id firstName lastName username Image' })

      .limit(Limit)
      .skip(skipAmount)
      //@ts-ignore
      .sort(sortOrder)

    const PromptCount = await Prompt.countDocuments(conditions);
    return {
      data: JSON.parse(JSON.stringify(Prompts)),
      totalPages: Math.ceil(PromptCount / Limit),
    };
  } catch (error) {
    console.error(error);
    return {
      data: [],
      totalPages: 0,
    };
  }
}
export async function LikePrompt({promptId, userId}: any) {
  await connectToDatabase();
  const prompt = await Prompt.findById(promptId);
  if (!prompt.likedBy.includes(userId)) {
    const like = await Prompt.findByIdAndUpdate(promptId, { $inc: { likes: 1 }, $push: { likedBy: userId } });
    return JSON.parse(JSON.stringify(like));
  }
  

}
export async function DislikePrompt({promptId, userId}: any) {
  await connectToDatabase();
  const prompt = await Prompt.findById(promptId);
  if (!prompt.dislikedBy.includes(userId)) {
    const like = await Prompt.findByIdAndUpdate(promptId, { $inc: { dislikes: 1 }, $push: { dislikedBy: userId } });
    return JSON.parse(JSON.stringify(like));
  }
}
export async function UnlikePrompt({promptId, userId}: any) {
  await connectToDatabase();
  const prompt = await Prompt.findById(promptId);
  if (prompt.likedBy.includes(userId)) {
    const unlike = await Prompt.findByIdAndUpdate(promptId, { $inc: { likes: -1 }, $pull: { likedBy: userId } });
    return JSON.parse(JSON.stringify(unlike));
  }
}
export async function UnDislikePrompt({promptId, userId}: any) {
  await connectToDatabase();
  const prompt = await Prompt.findById(promptId);
  if (prompt.dislikedBy.includes(userId)) {
    const unlike = await Prompt.findByIdAndUpdate(promptId, { $inc: { dislikes: -1 }, $pull: { dislikedBy: userId } });
    return JSON.parse(JSON.stringify(unlike));
  }
}
type GetRelatedPromptsProps = {
  tags: string
  prompt: string
}
export async function GetRelatedPrompts({tags, prompt}: GetRelatedPromptsProps) {
    try {
      await connectToDatabase()
      const prompts = await Prompt.find({tags: {$in: tags}, 
      prompt: { $ne: prompt}}).limit(3).populate({ path: 'organizer', model: User, select: '_id firstName lastName username Image' })
      .collation( {locale: 'en', strength: 1})
      return JSON.parse(JSON.stringify(prompts))
    } catch (error) {
      console.error(error)
      return
    }

}
export async function addComment({promptId, commentId}: any) {
  try {
    await connectToDatabase()
    const prompt = await Prompt.findByIdAndUpdate(promptId, { $push: { comments: commentId } })
    return JSON.parse(JSON.stringify(prompt))
  } catch (error) {
    console.error(error)
    return
  }
}
export async function getComments(promptId: any) {
  try {
    await connectToDatabase()
    const prompt = await Comment.find({prompt: promptId})
    return JSON.parse(JSON.stringify(prompt))
  } catch (error) {
    console.error(error)
    return
  }
}