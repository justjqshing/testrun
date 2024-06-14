
"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "../ui/Hero-Bg";
export const Hero = () => {
  return (
    <HeroHighlight>
        <div className="flex flex-col text-center">
            <h1 className="text-6xl text-black font-bold uppercase mt-[20vh]">
                Welcome to Promptopia
            </h1>
            <p>A place to Share and Discover AI prompts</p>

        </div>
   
  </HeroHighlight>
  )
}
