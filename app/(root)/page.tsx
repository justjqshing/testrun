
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
import { auth } from '@clerk/nextjs/server';
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
  const page = (searchParams?.page as string) || 1;
  const { sessionClaims } = auth()

  const userid = sessionClaims?.userId as string

  return (
    <main className=''>
     <Hero Query={searchText} Tag={TagText} UserId={userid} page={page}/>
    </main>
  );
}
