import { UserContext } from '@/app/_context/UserContext'
import { Progress } from '@radix-ui/react-progress'
import { useUser } from '@stackframe/stack'
import React, { useContext } from 'react'

const Credits = () => {
    const {userData}=useContext(UserContext)
    const user=useUser()
  return (
    <div>
        <div className='flex items-center gap-5'>
            <img src={user?.profileImageUrl ?? ''} width={60} height={60} alt="User Profile" className='rounded-full mt-3' />
            <div>
                <h2 className='text-lg font-bold'>{user?.displayName}</h2>
                <h2 className='text-gray-500'>{user?.primaryEmail}</h2>
            </div>
        </div>
        <hr className='my-3'/>
        <h2 className='font-bold'>Token Used</h2>
        <h2>30000/50000</h2>
        <Progress value={33} className='w-full h-3 bg-gray-200 rounded-full'/>
    </div>
  )
}

export default Credits