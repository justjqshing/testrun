import PromptForm from '@/components/shared/Form'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
const page = () => {
  const { sessionClaims } = auth()

    const userid = sessionClaims?.userId as string
  return (
    <PromptForm userId={userid}/>
  )
}

export default page