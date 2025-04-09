"use client"

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Id } from '@/convex/_generated/dataModel'; // Import Id type
import Image from 'next/image'; // Corrected import
import { Coachingclass } from '@/services/Options';
import moment from 'moment';
import ChatBox from '../../discussion-room/[roomid]/_components/ChatBox';
import SummeryBox from './_components/SummeryBox';

const ViewSummery = () => {
    const { roomid } = useParams() as { roomid?: string };

    // Ensure roomid is defined before calling useQuery
    const DiscussionRoomData = roomid
        ? useQuery(api.functions.Discussion.GetDiscussion, {
            id: roomid as Id<"Discussion">,
        })
        : null;
    console.log("{View-summery}DiscussionRoomData", DiscussionRoomData);

    const GetAbstractImages = (option: any) => {
        const coachingOption = Coachingclass.find((e) => e.name === option);
        return coachingOption?.abstract || '';
    }

    return (
        <div className='-mt-10'>
            {DiscussionRoomData && (
                <div className='flex justify-between items-end'>
                    <div className='flex items-center gap-7'> 
                        <Image
                            src={GetAbstractImages(DiscussionRoomData.coachingOption)}
                            alt='abstract'
                            height={100}
                            width={100}
                            className='rounded-full h-[70px] w-[70px]'
                        />
                        <div>
                            <h2 className='text-lg font-bold'>{DiscussionRoomData.topic}</h2>
                            <span className='text-gray-500'>{DiscussionRoomData.coachingOption}</span>
                        </div>
                    </div>
                    <span className='text-gray-400'>{moment(DiscussionRoomData._creationTime).fromNow()}</span>
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-5 mt-5'>
                <div className='col-span-3'>
                    <h2 className='text-lg font-bold mb-6'>Summery of Your Conversation</h2>
                    <div className='border border-gray-300 rounded-lg p-5 shadow-md bg-white'>
                        <SummeryBox summery={DiscussionRoomData?.summery} />
                    </div>
                </div>
                <div className='col-span-2'></div>
                <div>
                    <h2 className='text-lg font-bold mb-6'>Your Conversation</h2>
                    {DiscussionRoomData?.conversation && (
                        <ChatBox
                            conversatation={DiscussionRoomData?.conversation}
                            coachingOption={DiscussionRoomData?.coachingOption}
                            EnableFeedbackNotes={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSummery;
