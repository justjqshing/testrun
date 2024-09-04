'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import { formUrlQuery } from '@/utils/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { DislikePrompt, LikePrompt, UnlikePrompt, getPromptById, UnDislikePrompt } from '@/lib/actions/prompt.actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

interface CardProps {
  prompt: {
    title: string;
    likes: number;
    prompt: string;
    description: string;
    likedBy: string[];
    dislikes: number;
    dislikedBy: string[];
    tags: string[];
    _id: string;
    organizer: {
      firstName: string;
      username: string;
      Image: string;
      _id: string;
    };
  };
}

const RelatedCard = ({ prompt }: CardProps) => {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [likes, setLikes] = useState(prompt.likes);
  const [dislikes, setDislikes] = useState(prompt.dislikes);

  useEffect(() => {
    const fetchPrompt = async () => {
      const newPrompt = await getPromptById(prompt._id);
    };
    fetchPrompt();
  }, [prompt._id]);

  const handleClick = useCallback((tag: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'tag',
      value: tag,
    });

    if (tag !== searchParams.get('tag')) {
      router.push(newUrl, { scroll: false });
    }
  }, [searchParams, router]);

  

  const formatLikes = (likes: number) => {
    if (likes > 999) {
      return (likes / 1000).toFixed(1) + 'k';
    }
    return likes.toString();
  };

  return (
    <div className={`bg-white dark:bg-zinc-800 border-black border-2 rounded-md border-opacity-10 p-3 w-[350px] max-sm:w-[300px] overflow-ellipsis `} onMouseEnter={() => setHover(!hover)}>
      <Link href={`/prompt/${prompt._id}`}>
        <div className='w-full '>
          <div className='flex flex-row gap-3 justify-start items-center'>
            <Image src={prompt.organizer.Image} width={36} height={36} alt='Author Image' className='rounded-full'></Image>
            <div className='flex justify-between w-full items-center'>
              <h1>{prompt.organizer.firstName}</h1>
            </div>
            </div>
          <div className='flex flex-col justify-start items-start'>
            <h1 className='text-2xl font-bold max-w-[280px] truncate'>{prompt.title}</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 max-w-[280px] truncate'>{prompt.description}</p>
          </div>
        </div>
      </Link>
      <div className='flex flex-row gap-2 mt-2 mb-3'>
        {prompt.tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => handleClick(tag)}
            className='bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer'
          >
            {tag}
          </span>
        ))}
      </div>
      <div className='flex flex-row -mb-3'>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger className='text-start flex items-start'>
            {formatLikes(likes - dislikes)}
            </TooltipTrigger>
            <TooltipContent>
          {likes - dislikes}
        </TooltipContent>
        </Tooltip>
        </TooltipProvider>
    
      </div>
    </div>
  );
};

export default RelatedCard;