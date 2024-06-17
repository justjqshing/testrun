// @ts-nocheck
'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { FindAllUsers, GetuserbyID } from '@/lib/actions/user.actions'
import { useState } from 'react'
import { set } from 'mongoose'
import { createPrompt } from '@/lib/actions/prompt.actions'

const GetUsers = ({userId}: any) => {
    const [Users, setUsers] = useState([])

    const handleClick = async () => {
      const users = await FindAllUsers()
        setUsers(users)


    }
    useEffect(() => {
      Users.map((user) => {
        if(user._id === userId) {
          console.log(user.firstName)
        }
      })
      console.log(Users)
    }, [Users])
  return (
    <div>
       <Button variant='outline' className='rounded-full' size='lg' onClick={async() => await createPrompt()}></Button>
        </div>

  )
}

export default GetUsers