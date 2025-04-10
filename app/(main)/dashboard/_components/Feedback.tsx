"use client"
import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Coachingclass } from '@/services/Options'
import { useConvex } from 'convex/react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { Link } from 'lucide-react'

const Feedback = () => {
  const convex = useConvex()
  const { userData } = useContext(UserContext)
  const [discussionList, setDiscussionList] = useState<any[]>([])

  const GetDiscussionRoom = async () => {
    if (!userData?._id) {
      return; // Ensure user ID exists
    }
    try {
      const result = await convex.query(api.functions.Discussion.GetAllDiscussion, {
        uid: userData._id
      })
      setDiscussionList(result || []) // Ensure array is set
    } catch (error) {
      console.error("{History.tsx} Error fetching discussions:", error)
    }
  }

  useEffect(() => {
    if (userData) {
      GetDiscussionRoom();
    }
  }, [userData]) // Ensure userData is fully loaded before calling GetDiscussionRoom

  const GetAbstractImages = (option: any) => {
    const coachingOption = Coachingclass.find((e) => e.name === option);
    return coachingOption?.abstract || '';
  }

  return (
    <div>
      <h2 className='text-xl font-bold'>Feedback</h2>
      {discussionList.length === 0 && (
        <h2 className='text-gray-500'>You don't have any previous Feedback</h2>
      )}
      <div className='mt-5'>
        {discussionList.map((item: any, index: number) => (item.coachingOption === 'Mock Interviews' || item.coachingOption === 'Ques Ans Prep') && (
          <div key={index} className='cursor-pointer pb-4 border-b-[2px] mb-4 group flex justify-between items-center'>
            <div className='flex items-center justify-between'>
            <div>
              <Image src={GetAbstractImages(item.coachingOption)} alt='abstract' width={70} height={50}
               className='rounded-full h-[50px] w-[50px]'/>
              <div>
                <h2 className='text-lg font-semibold'>{item.topic}</h2>
                <p className='text-gray-500'>{item.coachingOption}</p>
                <h2 className='text-gray-400'>{moment(item._creationTime).fromNow()}</h2>
              </div>
            </div>
            </div>
            <Link href={`/view-summery/${item._id}`}>
            <Button variant="outline" className='invisible group-hover:visible'>View Notes</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feedback