// @ts-nocheck
'use client'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { FindAllUsers, GetuserbyID } from '@/lib/actions/user.actions'
import { useState } from 'react'
import { set } from 'mongoose'

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
        <Button  variant='outline' className='text-black ' onClick={() => handleClick()} > Users</Button>
        {Users.map((user) => (
          <div>
            <h1 className={`${user._id === userId ? 'text-green-600' : ''}`}>{user.firstName}</h1>
            <h1 className={`${user._id === userId ? 'text-green-600' : ''}`}>{user._id}</h1>
            <h1 className={`${user._id === userId ? 'text-green-600' : ''}`}>{userId}</h1>
            </div>
          
          

        ))}
       
        </div>

  )
}

export default GetUsers