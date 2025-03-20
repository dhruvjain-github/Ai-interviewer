import React from 'react'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'

const Header = () => {
  return (
    <div className='bg-gray-200 p-3 shadow-sm flex justify-between items-center'>
        <Image 
        src='/logo.svg'
        alt='logo' 
        width={200} 
        height={200}
        />

        <UserButton/>
    </div>
  )
}

export default Header