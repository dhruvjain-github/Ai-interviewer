import React from 'react'
import Header from './_components/Header'

const layout = ({children}:any) => {
  return (
    <div>
      <Header />
      <div className='p-10 mt-20 md:px-20 lg:px-32 xl:px-56 2xl:px-72'>
       {children}
      </div>
      
    </div>
  )
}

export default layout