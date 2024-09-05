'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { formUrlQuery } from '@/utils/utils'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { set } from 'mongoose'
const TagSearch = ({reset, setReset, defaultVal}: any) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get('tag') || '');
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'tag',
            value: query,
          });
    
          if (query !== searchParams.get('tag')) {
            router.push(newUrl, { scroll: false });
          }
        }, 100);
    
        return () => clearTimeout(delayDebounceFn); // Clear timeout on unmount
      }, [query, pathname]); 
      const handleInputChange = (e: any) => {
        setReset(false);
        setQuery(e.target.value); 

    
      };
  return (
    <div className='flex justify-center items-center min-h-[54px] overflow-hidden rounded-full bg-gray-50 dark:bg-zinc-800 px-4 py-2 flex-1 '>
      <Image src='/assets/Icons/Search.svg' width={24} height={24} alt='search icon' className='dark:hidden'/>
      <Image src='/assets/Icons/Dark-Search.svg' width={24} height={24} alt='search icon' className='hidden dark:block'/>
      <Input
        type="text"
        placeholder='Search Tags...'
        value={reset ? '' : query}
        onChange={handleInputChange}
        defaultValue={defaultVal}

        className="p-regular-16 border-0 bg-transparent outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white" 
      />
    </div>
  )
}

export default TagSearch
