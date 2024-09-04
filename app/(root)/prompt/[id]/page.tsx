'use client';
import { addComment, getPromptById } from "@/lib/actions/prompt.actions";
import { GetRelatedPrompts } from "@/lib/actions/prompt.actions";
import RelatedCard from "@/components/shared/RelatedCard";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateComment } from "@/lib/actions/comments.actions";
import { useUser } from "@clerk/nextjs";
import { motion } from 'framer-motion'
import { createNestedComment, GetallNestedComments, UnLikeNestedComment } from "@/lib/actions/nested.actions";
import Image from "next/image";
import { LikeNestedComment } from "@/lib/actions/nested.actions";
import { getAuth } from "@clerk/nextjs/server";
import { GetidByclerk } from "@/lib/actions/user.actions";

const MAX_INDENT_LEVEL = 3;
const page = ({ params: { id }, searchParams }: any) => {
  const { user } = useUser();
  const PFP = user?.imageUrl;
  const userId = user?.id;
  const [Prompt, setPrompt] = useState<any>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<any[]>([]);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subcomment, setSubcomment] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  const [nestedComments, setNestedComments] = useState<string[]>([]);
  const [showReply, setShowReply] = useState<string>('');
  const [NestedCommentText, setNestedCommentText] = useState<string>('');
  const [UserIDObject, setUserIDObject] = useState<any>()
  const [activeLike, setActiveLike] = useState<string[]>([])
  const [activeUnLike, setActiveUnLike] = useState<string[]>([])
  
  useEffect(() => {
    const fetchData = async () => {

      let prompt = await getPromptById(id);
      let relatedPrompts = await GetRelatedPrompts({ tags: prompt.tags, prompt: prompt.prompt });
      let nested = await GetallNestedComments();

      setPrompt(prompt);
      setRelatedPrompts(relatedPrompts);
      setLoading(false);
      setComments(prompt.comments);
      setNestedComments(nested);
      
    };
    fetchData();
  }, [id, refresh]);
  useEffect(() => {
    const fetchData = async () => {
    console.log('the user is ' + userId)

    const userData = await GetidByclerk(userId)


    setUserIDObject(userData[0]?._id)
    }
    fetchData()
  }, [userId])

  const renderNestedComments = (parentId: string, level: number = 0) => {

    return nestedComments
      .filter((nested: any) => nested.parentComment === parentId)
      .map((nested: any, index: any) => (
        
        <div key={index} className={`flex flex-col w-full ${level < MAX_INDENT_LEVEL ? 'ml-7' : ''} border-l border-l-gray-200 max-w-2xl mt-3 text-white shadow-md rounded-lg p-4 mb-4`}>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 text-center items-center">
                <Image src={nested.Creator.Image} alt="Profile" width={32} height={28} className="rounded-full"/>
                <p className="mb-2">{nested.Creator.username}</p>
              </div>
            <p className="mb-2">{nested.comment}</p>
            </div>
            <Image src="/assets/Icons/Reply.svg" alt="Reply" width={24} height={24} onClick={() => {
              setShowReply(nested._id);
            }} className="cursor-pointer"/>
          </div>
          
          <div className={`flex flex-row gap-3 ${showReply === nested._id ? 'block' : 'hidden'}`}>
            <Input className="w-full mb-2" value={NestedCommentText} placeholder="Add a comment" onChange={(e) => {
              setNestedCommentText(e.target.value);
            }}></Input>
            <Button
              className={`bg-blue-500 text-white ${NestedCommentText.length < 2 ? 'cursor-not-allowed bg-blue-800 hover:bg-blue-800' : 'hover:bg-blue-700'}`}
              onClick={async () => {
                setNestedCommentText('')
                if(NestedCommentText.length < 2) return;
                const nest = await createNestedComment(NestedCommentText, nested._id, nested.mainComment, userId, id);
                setRefresh(!refresh);;
                setShowReply('');
              }}
            >
            Add Comment
          </Button>
          

          </div>
          <div className="flex flex-row gap-3">
            <Button className="bg-green-500 text-white hover:bg-blue-700" onClick={async() => {
              if(nested.likedBy.includes(UserIDObject)){
                setActiveUnLike(activeUnLike => [...activeLike, nested._id]);
                const unLike = await UnLikeNestedComment({userId: userId, CommentID: nested._id})
              } else {
                setActiveLike(activeLike => [...activeLike, nested._id]);
                console.log(activeLike)
                const like = await LikeNestedComment({userId: userId, CommentID: nested._id});
              }
              
            }}>Like</Button>
            <p>{activeLike.includes(nested._id) ? nested.likes + 1 : activeUnLike.includes(nested._id) ? nested.likes - 1 : nested.likes  }</p>
          </div>
          {renderNestedComments(nested._id, level + 1)}
        </div>
      ));
  };

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center p-4 mt-20">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col items-center p-4 mt-20">
    {Prompt && (
      <div key={Prompt._id} className="flex flex-col w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{Prompt.title}</h1>
        <p className="text-gray-600 mb-6">{Prompt.description}</p>
        <p className="text-gray-700 mb-6">{Prompt.prompt}</p>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Related Prompts</h2>
          <div className="grid grid-cols-1 gap-6">
            {relatedPrompts.map((prompt: any, index: any) => (
              <RelatedCard prompt={prompt} key={index} />
            ))}
          </div>
        </div>
        {Prompt.organizer && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Organizer</h2>
            <p className="text-gray-600">{Prompt.organizer.firstName} {Prompt.organizer.lastName}</p>
            <p className="text-gray-500 text-sm">{Prompt.organizer._id}</p>
          </div>
        )}
      </div>
    )}
    <Input className="w-full max-w-3xl mb-4 p-4 border border-gray-300 rounded-lg" placeholder="Add a comment" value={comment} onChange={(e) => {
      setComment(e.target.value);
    }}></Input>
    <Button className="bg-red-500 text-white hover:bg-green-700 p-4 rounded-lg" onClick={async() => {
      setComments(comments => [...comments, { comment }]);
      setComment('');
      const create = await CreateComment({UserId: userId, comment: comment, prompt: id});
      await addComment({promptId: id, commentId: create?.id});
      setRefresh(!refresh);
    }}>Add Comment</Button>
    <div className="flex flex-col justify-center items-center  w-[50vw] mb-6 p-6 rounded-lg shadow-lg">
      {comments.map((comment: any, index: any) => (
        <div key={index} className="flex flex-col text-white shadow-md rounded-lg p-6 mb-4 border-l border-white">
          <div className="flex flex-col items-start mb-4 ">
            <div className="flex flex-row gap-2 text-center items-center">
              <Image src={comment.Creator?.Image || PFP} alt="Profile" width={32} height={28} className="rounded-full"/>
              <p className="mb-2">{comment.Creator?.username}</p>
            </div>
            <div className="flex flex-row justify-between w-full mb-3 mt-2">
            <p className="flex-grow text-white ">{comment.comment}</p>
            <Image src="/assets/Icons/Reply.svg" alt="Reply" width={24} height={24} onClick={() => {
              setShowReply(comment._id)
              
              
            }} className="cursor-pointer"/>
            </div>
            <div className="flex flex-row gap-3">
           
            <Input className={`w-full max-w-xs mr-2 ${showReply === comment._id ? 'block' : 'hidden'}`} placeholder="Add a comment" onChange={(e) => {
              setSubcomment(e.target.value);
            }}></Input>
            <Button className={`bg-red-500 text-white hover:bg-blue-700  ${showReply === comment._id ? 'block' : 'hidden'}`} onClick={async() => {
              const create = await CreateComment({UserId: userId, comment: subcomment, prompt: id});
              const nest = await createNestedComment(subcomment, comment._id, comment._id, userId, id);
              setRefresh(!refresh);
            }}>Add Comment</Button>
            </div>
          </div>
          <div className="ml-10">
            {renderNestedComments(comment._id)}
          </div>
        </div>
      ))}
    </div>
    
  </div>
  );
};

export default page;