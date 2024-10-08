'use server'

import { revalidatePath } from 'next/cache'
import User from '@/database/models/user.model'
import { connectToDatabase } from '@/database'
import { ClerkLoaded } from '@clerk/nextjs'
type CreateUserParams = {
clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  Image: string
}
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    console.error(error)
    return
  }
}
export async function FindAllUsers() {
    try {
      await connectToDatabase()
  
      const Users = await User.find()
      return JSON.parse(JSON.stringify(Users))
    } catch (error) {
      console.error(error)
      return
    }
  }


export async function UpdateUser(id: string, user: CreateUserParams) {
  try {
    await connectToDatabase()

    const Users = await User.findOneAndUpdate({ clerkId: id}, user)
    return JSON.parse(JSON.stringify(Users))
  } catch (error) {
    console.error(error)
    return
  }
}
export async function GetidByclerk(id: any) {

  try {
    console.log('NEW YORKKKKKKK')
    await connectToDatabase()

    const Users = await User.find({ clerkId: id })
    return JSON.parse(JSON.stringify(Users))
  } catch (error) {
    console.error(error)
    return
  }
}
export async function deleteUser(id: string) {
  try {
    await connectToDatabase()

    const Users = await User.findOneAndDelete({ clerkId: id })
    return JSON.parse(JSON.stringify(Users))
  } catch (error) {
    console.error(error)
    return
  }
}
