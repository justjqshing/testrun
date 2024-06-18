'use client'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { formUrlQuery } from '@/utils/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface CardProps {
  UserId: string;
  Limit: number;
  Index: number;
  totalPages: number;
  prompt: {
    title: string;
    prompt: string;
    description: string;
    tags: string[]
    _id: string;
    organizer: {
        firstName: string;
        username: string;
        Image: string;
        _id: string;
        };
    }
  };


const Card = ({ prompt, UserId, Limit, Index, totalPages }: CardProps) => {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClick = (tag: any) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'tag',
      value: tag,
    });

    if (tag !== searchParams.get('tag')) {
      router.push(newUrl, { scroll: false });
    }
  }
  return (

    <div className={`bg-white dark:bg-zinc-800 border-black border-2 rounded-md border-opacity-10 p-3 w-full max-w-[350px] min-w-[350px] overflow-ellipsis ${Limit - 1 === Index && totalPages == 1 ? 'mb-5' : ''}`} onMouseEnter={() => setHover(!hover)}>
        <Link href={`/prompt/${prompt._id}`}>
    <div className='w-full '>
      <div className='flex flex-row gap-3 justify-start items-center'>
    <Image src={prompt.organizer.Image} width={36} height={36} alt='Author Image' className='rounded-full'></Image>
    <div className='flex justify-between w-full items-center'>

    <h1>{prompt.organizer.firstName}</h1>
    <div className=' h-10 w-5'>
    <Link href={`/prompt/${prompt._id}/update`}>
      <Image src='/assets/icons/Edit.svg' width={20} height={20} alt='More Icon' className={`${UserId === prompt.organizer._id ? 'flex' : 'hidden'}`}></Image>
      </Link>
     

    </div>
          
    </div>
    </div>
    <div className='flex flex-col justify-start items-start'>

    <h1 className='text-2xl font-bold'>{prompt.title}</h1>
    <h1 className='max-w-[330px] max-h-[50px] truncate'>{prompt.prompt}</h1>
    </div>
    </div>
    </Link>

    <div className='flex flex-row z-[50] gap-3'>

    {prompt.tags.map((tag, index) => (
        <div key={index} onClick={() => handleClick(tag)}>
            <span className='text-blue-500'>#{tag}</span>
        </div>
    
    ))}
          
    </div>
          


    </div>

  )
}

export default Card