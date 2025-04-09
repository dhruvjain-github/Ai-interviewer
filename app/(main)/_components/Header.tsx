import React from 'react'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'

const Header = () => {
  return (
    <div className='bg-gray-200 p-3 shadow-sm flex justify-between items-center h-20'>
        <div>
        <Image 
        src='/logo2.png'
        alt='logo' 
        width={200} 
        height={200}
        />
        </div>
        
        <UserButton/>
    </div>
  )
}

export default Header