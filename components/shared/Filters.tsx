'use client'
import React from 'react'
import Search from './Search'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TagSearch from './TagSearch'

const Filters = ({Query, Tag}: any) => {
  const [resetSearch, setResetSearch] = useState(false);
  const router = useRouter();
  const HandleClick = () => {
    const newSearchParams = new URLSearchParams();

    newSearchParams.forEach((_, value) => newSearchParams.delete(value));
    router.push(`?${newSearchParams.toString()}`, { scroll: false }); 
    setResetSearch(true)
  }
  return (
    <div className='flex items-center gap-7'>
      <Search reset={resetSearch} setReset={setResetSearch} defaultVal={Query}/>

      <TagSearch reset={resetSearch} setReset={setResetSearch} defaultVal={Tag}/>
      <Button variant='destructive' className='min-h-[54px] min-w-[120px] rounded-xl' onClick={HandleClick}>Clear</Button>
    </div>
  )
}

export default Filters