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
import { getComments } from '@/lib/actions/prompt.actions';
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
  UserId: string;
  Limit: number;
  Index: number;
  totalPages: number;
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

const Card = ({ prompt, UserId, Limit, Index, totalPages }: CardProps) => {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(prompt.likes);
  const [dislikes, setDislikes] = useState(prompt.dislikes);
  const [open, setOpen] = useState(false);
  const [playLike, setPlayLike] = useState(true);
  const [closeAll, setCloseAll] = useState(true);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchPrompt = async () => {
      const newPrompt = await getPromptById(prompt._id);
      const comments = await getComments(prompt._id);
      setComments(comments);
      setLiked(newPrompt.likedBy.includes(UserId));
      setDisliked(newPrompt.dislikedBy.includes(UserId));
      
    };
    fetchPrompt();
  }, [prompt._id, UserId]);
  useEffect(() => {
    console.log(comments)
  }, [comments])

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

  const handleLike = useCallback(async () => {
    if(UserId){
      setPlayLike(true);
      const newLiked = !liked;
      const newLikes = newLiked ? likes + 1 : likes - 1;
      const newDisliked = disliked && newLiked;
      const newDislikes = newDisliked ? dislikes - 1 : dislikes;

      setLiked(newLiked);
      setLikes(newLikes);
      if (newDisliked) {
        setDisliked(false);
        setDislikes(newDislikes);
      }

      try {
        if (newLiked) {
          await LikePrompt({ promptId: prompt._id, userId: UserId });
          if (newDisliked) {
            await UnDislikePrompt({ promptId: prompt._id, userId: UserId });
          }
        } else {
          await UnlikePrompt({ promptId: prompt._id, userId: UserId });
        }
      } catch (error) {
        // Revert state if API call fails
        setLiked(!newLiked);
        setLikes(likes);
        if (newDisliked) {
          setDisliked(true);
          setDislikes(dislikes);
        }
      }
    } else {
      setOpen(true);
    }
  }, [liked, disliked, likes, dislikes, prompt._id, UserId]);

  const handleDislike = useCallback(async () => {
    if(UserId){
      setPlayLike(false);
      const newDisliked = !disliked;
      const newDislikes = newDisliked ? dislikes + 1 : dislikes - 1;
      const newLiked = liked && newDisliked;
      const newLikes = newLiked ? likes - 1 : likes;

      setDisliked(newDisliked);
      setDislikes(newDislikes);
      if (newLiked) {
        setLiked(false);
        setLikes(newLikes);
      }

      try {
        if (newDisliked) {
          await DislikePrompt({ promptId: prompt._id, userId: UserId });
          if (newLiked) {
            await UnlikePrompt({ promptId: prompt._id, userId: UserId });
          }
        } else {
          await UnDislikePrompt({ promptId: prompt._id, userId: UserId });
        }
      } catch (error) {
        // Revert state if API call fails
        setDisliked(!newDisliked);
        setDislikes(dislikes);
        if (newLiked) {
          setLiked(true);
          setLikes(likes);
        }
      }
    } else {
      setOpen(true);
    }
  }, [disliked, liked, dislikes, likes, prompt._id, UserId]);

  const formatLikes = (likes: number) => {
    if (likes > 999) {
      return (likes / 1000).toFixed(1) + 'k';
    }
    return likes.toString();
  };

  return (
    <div onClick={open && closeAll ? () => setOpen(false) : undefined} className={`bg-white dark:bg-zinc-800 border-black border-2 rounded-md border-opacity-10 p-3 w-[350px] max-sm:w-[300px] overflow-ellipsis `} onMouseEnter={() => setHover(!hover)}>
      <Link href={`/prompt/${prompt._id}`}>
        <div className='w-full '>
          <div className='flex flex-row gap-3 justify-start items-center'>
            <Image src={prompt.organizer.Image} width={36} height={36} alt='Author Image' className='rounded-full'></Image>
            <div className='flex justify-between w-full items-center'>
              <h1>{prompt.organizer.firstName}</h1>
              <div className=' h-10 w-5'>
                <Link href={`/prompt/${prompt._id}/update`}>
                  <Image src='/assets/Icons/Edit.svg' width={20} height={20} alt='More Icon' className={`${UserId === prompt.organizer._id ? 'flex' : 'hidden'}`}></Image>
                </Link>
              </div>
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
      <div className='flex gap-2 flex-row'>

      <div className='flex flex-row -mb-1 h-[28px] p-2 items-center justify-center w-fit bg-zinc-700 rounded-2xl '>
       
        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <Image 
            src={liked ? '/assets/Icons/Liked.svg' : '/assets/Icons/Like.svg'} 
            width={40} 
            height={40} 
            alt='Like Icon' 
            onClick={handleLike} 
          />
        </motion.div>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger className='text-start flex items-start'>
              <AnimatePresence mode='wait'>
                <motion.h1
                  key={`likes-dislikes-${likes}-${dislikes}`} // Change the key to a unique value
            initial={{ opacity: 0, y: playLike ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: playLike ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className='min-w-[2ch] flex justify-center text-center '
          >
            {formatLikes(likes - dislikes)}
              </motion.h1>
            </AnimatePresence>
            </TooltipTrigger>
            <TooltipContent>
          {likes - dislikes}
        </TooltipContent>
        </Tooltip>
        </TooltipProvider>
        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <Image 
            src={disliked ? '/assets/Icons/Disliked.svg' : '/assets/Icons/Dislike.svg'} 
            width={40} 
            height={40} 
            alt='Dislike Icon' 
            onClick={handleDislike} 
          />
        </motion.div>

      </div>
              

      <div onClick={() => router.push(`/prompt/${prompt._id}`)} className='flex flex-row -mb-1 h-[28px] p-2 gap-2 items-center justify-center w-fit bg-zinc-700 rounded-2xl hover:cursor-pointer'>
       
       <Image src='/assets/Icons/Comment.svg' width={20} height={20} alt='Comment Icon'/>
       <h1>
        {comments.length}
       </h1>

      </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onMouseEnter={() => setCloseAll(false)} onMouseLeave={() => setCloseAll(true)}>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to like or dislike a prompt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/login')}>Login</Button>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Card;
