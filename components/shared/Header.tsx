

import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import GetUsers from './getUsers'
import { auth } from '@clerk/nextjs/server'

const Header = () => {
    const { sessionClaims } = auth()

    const userid = sessionClaims?.userId as string

  return (
    <header className="w-full border-b p-3">
        <div className='wrapper flex items-center justify-between'>
            <Link href='/' className='w-36'>
                <Image src='/next.svg' width={128} height={38} alt='Evently Logo'/>
            </Link>
            <SignedIn>
                <nav className='md:flex-between  hidden w-full max-w-xs'>
               
                </nav>
            </SignedIn>
            <div className='flex w-32 justify-end gap-3'>
                <SignedOut>
                    <Button asChild className='rounded-full' size='lg'>
                        <Link href='/sign-in'>Sign In</Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl='/'/>
                </SignedIn>
                
            </div>
            <GetUsers userId={userid}/>

        </div>
    </header>
  )
}

export default Header