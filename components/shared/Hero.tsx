
"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/Hero-Bg";
import Collecton from "./Collecton";
import { Suspense } from "react";
import { useEffect } from "react";
export const Hero = ({Query, Tag}: any) => {
  useEffect(() => {
    console.log(`the tag is ${Tag}`);
  }, [Query, Tag]);
  return (
    <HeroHighlight>
        <div className="flex flex-col text-center">
            <h1 className="text-6xl text-black font-bold uppercase mt-[20vh]">
                Welcome to Promptopia
            </h1>
            <p>A place to Share and Discover AI prompts</p>
            <Collecton Query={Query} Tag={Tag}/>
            

            

        </div>
   
  </HeroHighlight>
  )
}
