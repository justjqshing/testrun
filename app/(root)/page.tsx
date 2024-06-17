'use client'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import Link from "next/link";
import Image from "next/image";
import Header from '@/components/shared/Header';
import { Hero } from '@/components/shared/Hero';
import { useEffect } from 'react';
type SearchParamProps = {
  params: {
      id: string;
  };
  searchParams: {
      [key: string]: string | undefined;
  };
}
export default function Home({ searchParams }: SearchParamProps) {
  const searchText = (searchParams?.query as string) || '';
  const TagText = (searchParams?.tag as string) || '';
  useEffect(() => {  console.log(TagText)}, [searchText, TagText]);

  return (
    <main className=''>
     <Hero Query={searchText} Tag={TagText}/>
    </main>
  );
}
