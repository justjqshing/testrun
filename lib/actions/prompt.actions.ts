import { connectToDatabase } from "@/database"
import Prompt from "@/database/models/prompt.model"
type CreateUserParams = {
    email: string
    username: string
    
}

export async function CreatePrompt(values: CreateUserParams) {
  try {
    await connectToDatabase()

    const Users = await Prompt.create({...values})
    return JSON.parse(JSON.stringify(Users))
  } catch (error) {
    console.error(error)
    return
  }
}