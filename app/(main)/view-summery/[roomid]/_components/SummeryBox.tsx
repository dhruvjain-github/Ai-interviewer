import React from 'react'
import ReactMarkdown from 'react-markdown'

const SummeryBox = ({summery}:any) => {
  return (
    <div className='h-[60vh] overflow-auto text-base/8'>
        <ReactMarkdown >{summery}</ReactMarkdown>
    </div>
  )
}

export default SummeryBox