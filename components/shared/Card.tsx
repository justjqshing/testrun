import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { formUrlQuery } from '@/utils/utils';
import { useSearchParams, useRouter } from 'next/navigation';
interface CardProps {
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
        };
    }
  };


const Card = ({ prompt }: CardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleClick = (tag: any) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'tag',
      value: tag,
    });

    if (tag !== searchParams.get('query')) {
      router.push(newUrl, { scroll: false });
    }
  }
  return (

      <div className='bg-white border-black border-2 p-3 max-w-[350px] overflow-ellipsis'>
        <Link href={`/prompt/${prompt._id}`}>
    <div className='w-full '>
      <div className='flex flex-row gap-3 justify-start items-center'>
    <Image src={prompt.organizer.Image} width={36} height={36} alt='Author Image' className='rounded-full'></Image>
    <h1>{prompt.organizer.firstName}</h1>
    </div>
    <div className='flex flex-col justify-start items-start'>

    <h1 className='text-2xl font-bold'>{prompt.title}</h1>
    <h1 className='max-w-[330px] max-h-[50px] truncate'>{prompt.prompt}</h1>
    </div>
    </div>
    </Link>

    <div className='flex flex-row z-[50]'>

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