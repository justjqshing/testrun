//@ts-nocheck
'use client'

import { getAllPrompts } from "@/lib/actions/prompt.actions"
import { Suspense, useEffect, useState } from "react"
import Card from "./Card"
import Filters from "./Filters"
import { useSearchParams } from 'next/navigation'
import Pagination from "./Pagination"

const Collecton = ({Query, Tag, UserId, page}: any) => {
  const searchParams = useSearchParams()
  const limit = searchParams.get('limit') || 3

  const [prompts, setPrompts] = useState([])
  const [totalPages, setTotalPages] = useState()

  useEffect(() => {
    const fetchData = async () => {


      const prompt = await getAllPrompts({Query: Query, Tag: Tag, Limit: limit, page: page})

      setPrompts(prompt?.data)
      setTotalPages(prompt?.totalPages)

    }
    fetchData()
  }, [Query, Tag, limit, page])

  return (
    <div className='w-full mt-20'>
      <div className='w-full flex justify-center items-center'>
      <div className='md:min-w-[45vw] md:max-w-[45vw] px-5 flex justify-center items-center'>
        <Filters Query={Query} Tag={Tag}/>
      </div>
      </div>


    <div className='grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-2 mt-8 justify-items-center'>

      {prompts.map((prompt, index) => (
        prompt ? <Card key={prompt._id} prompt={prompt} UserId={UserId} Limit={limit} Index={index} totalPages={totalPages} /> : null
      ))}

    </div>
    <div className={` ${totalPages > 1 ? 'flex' : 'hidden'} mt-10 w-full justify-center`}>
      <Pagination totalPages={totalPages} limit={limit}/>
      </div>


    </div>
  )
}

export default Collecton