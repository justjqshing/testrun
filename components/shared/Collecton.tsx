//@ts-nocheck
'use client'

import { getAllPrompts } from "@/lib/actions/prompt.actions"
import { Suspense, useEffect, useState } from "react"
import Card from "./Card"
import Filters from "./Filters"
import { useSearchParams } from 'next/navigation'

const Collecton = ({Query, Tag}: any) => {

  const [prompts, setPrompts] = useState([])

  useEffect(() => {
    const fetchData = async () => {

      const prompt = await getAllPrompts({Query: Query, Tag: Tag})

      setPrompts(prompt)
    }
    fetchData()
  }, [Query, Tag])

  return (
    <div className='w-full mt-20'>
      <Filters Query={Query} Tag={Tag}/>


    <div className='grid grid-cols-3 gap-2 mt-8 '>
      <Suspense fallback={<div>Loading...</div>}>
      {prompts.map((prompt) => (
        prompt ? <Card key={prompt._id} prompt={prompt}/> : null
      ))}
      </Suspense>
    </div>
    </div>
  )
}

export default Collecton