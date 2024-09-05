'use client'
import React, { useEffect } from 'react'
import Search from './Search'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TagSearch from './TagSearch'
import Limit from './Limit'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Order from './Order'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
const Filters = ({Query, Tag, order}: any) => {
  const searchParams = useSearchParams();
  const [resetSearch, setResetSearch] = useState(false);
  const [resetTag, setResetTag] = useState(false);
  const [resetOrder, setResetOrder] = useState(false); // Add this line
  const router = useRouter();
  const [LimitVal, setLimitVal] = useState(searchParams.get('limit') || '')
  const [OrderVal, setOrderVal] = useState(searchParams.get('order') || '')
  const [resetLimit, setResetLimit] = useState(false);

  const HandleClick = () => {
    const newSearchParams = new URLSearchParams();

    newSearchParams.forEach((_, value) => newSearchParams.delete(value));
    router.push(`?${newSearchParams.toString()}`, { scroll: false }); 
    setResetSearch(true)
    setResetTag(true);
    setResetOrder(true); // Add this line
  }

  useEffect(() => {
    setLimitVal(searchParams.get('limit') || '')
  }, [searchParams])

  const QueryClick = () => {
    const newSearchParams = new URLSearchParams(window.location.search);

    newSearchParams.delete('query');
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
    setResetSearch(true);
  }
  const TagClick = () => {
    const newSearchParams = new URLSearchParams(window.location.search);

    newSearchParams.delete('tag');
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
    setResetTag(true);
  }
  const LimitClick = () => {
    const newSearchParams = new URLSearchParams(window.location.search);

    newSearchParams.delete('limit');
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
    setResetLimit(true);
  }
  const OrderClick = () => {
    const newSearchParams = new URLSearchParams(window.location.search);

    newSearchParams.delete('order');
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
    setResetOrder(true);
  }
  useEffect(() => {
    if (order === 'createdAt: -1') {
      setOrderVal('');
    } else if (order === 'createdAt: 1') {
      setOrderVal('Oldest First');
    } else if (order === 'likes: -1') {
      setOrderVal('Most Liked');
    } else if (order === 'likes: 1') {
      setOrderVal('Least Liked');
    } else {
      setOrderVal(order);
    }
  }, [order, OrderVal]);

  
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-center gap-7 md:max-w-[45vw] md:min-w-[45vw]'>
        <Search reset={resetSearch} setReset={setResetSearch} defaultVal={Query}/>
        <Dialog>
          <DialogTrigger> 
            <Image src='/assets/Icons/filter.svg' width={36} height={36} alt='edit icon' className='bg-[#F5F5F5] dark:bg-zinc-800 rounded-full p-3 flex min-h-[54px] min-w-[54px] dark:hidden'/>
            <div className='dark:bg-zinc-800 rounded-full p-3 h-[54px] w-[54px] hidden dark:flex'>
              <Image src='/assets/Icons/Dark-Filter.svg' width={36} height={36} alt='edit icon' className='opacity-[67%]'/>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='mb-6'>Filters and Sorting</DialogTitle>
              <DialogDescription className='flex flex-col justify-end gap-4'>
                <TagSearch reset={resetTag} setReset={setResetTag} defaultVal={Tag}/>
                <Limit reset={resetLimit} setReset={setResetLimit} defaultVal={6}/>
                <Order reset={resetOrder} setReset={setResetOrder} /> {/* Update this line */}
                <div className='w-full flex justify-end items-end gap-4'>
                  <DialogClose>
                    <Button variant='destructive' className='min-h-[54px] min-w-24 rounded-xl' onClick={HandleClick}>Clear</Button>  
                  </DialogClose>
                  <DialogClose>
                    <Button variant='outline' className='min-h-[54px] min-w-24 rounded-xl'>Save</Button>  
                  </DialogClose>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className='flex flex-row gap-4 max-sm:max-w-[300px] flex-wrap'>
        <div className={`bg-blue-600 flex px-4 mt-4 rounded-lg py-2 bg-opacity-80 w-fit gap-3 ${Query.length > 0 ? 'flex' : 'hidden'}`} onClick={() => QueryClick()}> 
          <span>{Query}</span>
          <Image src='/assets/Icons/Trash.svg' width={24} height={24} alt='Delete'/>
        </div>
        <div className={`bg-blue-600 flex px-4 mt-4 rounded-lg py-2 bg-opacity-80 w-fit gap-3 ${Tag.length > 0 ? 'flex' : 'hidden'}`} onClick={() => TagClick()}> 
          <span>{Tag.startsWith('#') ? Tag : `#${Tag}`}</span>
          <Image src='/assets/Icons/Trash.svg' width={24} height={24} alt='Delete'/>
        </div>
        <div className={`bg-blue-600 flex px-4 mt-4 rounded-lg py-2 bg-opacity-80 w-fit gap-3 ${LimitVal.length > 0 && LimitVal !== '3' ? 'flex' : 'hidden'}`} onClick={() => LimitClick()}> 
          <span>{LimitVal} Per Page</span>
          <Image src='/assets/Icons/Trash.svg' width={24} height={24} alt='Delete'/>
        </div>
        <div className={`bg-blue-600 flex px-4 mt-4 rounded-lg py-2 bg-opacity-80 w-fit gap-3 ${OrderVal.length > 0 ? 'flex' : 'hidden'}`} onClick={() => OrderClick()}> 
          <span>{OrderVal}</span>
          <Image src='/assets/Icons/Trash.svg' width={24} height={24} alt='Delete'/>
        </div>
      </div>
    </div>
  )
}

export default Filters
