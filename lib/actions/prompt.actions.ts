'use server'
import Search from "@/components/shared/Search"
import { connectToDatabase } from "@/database"
import Prompt from "@/database/models/prompt.model"
import User from "@/database/models/user.model"
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
  
      const newUser = await Prompt.create({...values, organizer: userId})
      return JSON.parse(JSON.stringify(newUser))
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
  
      const prompt = await Prompt.findById(id).populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
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
}
export async function getAllPrompts({Query, Tag, Limit, page}: SearchProps) {
  try {
    await connectToDatabase()
    
    console.log(Query)
    if(Tag.startsWith('#')) {
      Tag = Tag.slice(1)
    }
    console.log('Tag', Tag)

    const titleCondition = Query ? { title: { $regex: new RegExp(Query, 'i') } } : {}
    const tagsCondition = Tag ? { tags: { $regex: new RegExp(Tag, 'i') } } : {}
    const skipAmount = (Number(page) - 1) * Limit

    const conditions = {
      $and: [tagsCondition, titleCondition],
    }

    const Prompts = await Prompt.find(conditions).populate({ path: 'organizer', model: User, select: '_id firstName lastName username Image' }).limit(Limit).skip(skipAmount)

    const PromptCount = await Prompt.countDocuments(conditions)
    return{
      data: JSON.parse(JSON.stringify(Prompts)),
      totalPages: Math.ceil(PromptCount / Limit)
    } 
  } catch (error) {
    
  }
}