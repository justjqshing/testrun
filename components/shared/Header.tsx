

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import GetUsers from './getUsers'
import { auth } from '@clerk/nextjs/server'
import { createPrompt } from '@/lib/actions/prompt.actions'

const Header = () => {


    return (
        <header className="w-[100vw] absolute border-b p-3 z-[9999] bg-white dark:bg-black dark:bg-opacity-80 max-sm:px-4">
          <div className=' flex items-center justify-between px-3'>
            <Link href='/' className='w-36'>
              <Image src='/next.svg' width={128} height={38} alt='Evently Logo' className='dark:hidden'/>
              <Image src='/next-dark.svg' width={128} height={38} alt='Evently Logo' className='hidden dark:flex'/>
            </Link>
            <SignedIn>
              <nav className='hidden md:flex w-full max-w-xs justify-start'>
                {/* Add your nav items here */}
              </nav>
            </SignedIn>
            <div className='flex w-32 justify-end gap-3'>
              <SignedOut>
                <Button asChild className='rounded-full' size='lg'>
                  <Link href='/sign-in'>Sign In</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild variant='outline' className='rounded-full' size='lg'>
                  <Link href='/prompt/create'>Create Prompt</Link>
                </Button>
              </SignedIn>
              <SignedIn>
                <UserButton afterSignOutUrl='/'/>
              </SignedIn>
            </div>
          </div>
        </header>
      )
}

export default Header