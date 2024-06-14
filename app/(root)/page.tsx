
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

export default function Home() {
  return (
    <main className=''>
     <Hero/>
    </main>
  );
}
