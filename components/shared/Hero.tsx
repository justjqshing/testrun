
"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/Hero-Bg";
import Collecton from "./Collecton";
import { Suspense } from "react";
import { useEffect } from "react";
import { auth } from "@clerk/nextjs/server";;
export const Hero = ({Query, Tag, UserId, page}: any) => {
  useEffect(() => {
    console.log(`the tag is ${Tag}`);
  }, [Query, Tag]);

  return (
    <HeroHighlight>
        <div className="flex flex-col text-center">
            <h1 className="text-6xl max-sm:text-4xl text-black font-bold uppercase mt-[20vh] dark:text-white">
                Welcome to Promptopia
            </h1>
            <p>A place to Share and Discover AI prompts</p>
            <div className=" h-full w-full">
            <Collecton Query={Query} Tag={Tag} UserId={UserId} page={page}/>

            </div>

            

            

        </div>
   
  </HeroHighlight>
  )
}
