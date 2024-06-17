
import React from 'react'
import PromptForm from '@/components/shared/Form'
import { getPromptById } from '@/lib/actions/prompt.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
const UpdatePrompt = async ({ params: { id }, searchParams }: any) => {

    let prompt = await getPromptById(id)
    const { sessionClaims } = auth()

    const userId = sessionClaims?.userId as string

    if(userId !== prompt.organizer._id) {
        redirect(`/`)
    }
  return (
    <PromptForm userId={userId} promptDetails={prompt} promptID={id} type='Update'/>
  )
}

export default UpdatePrompt