"use client";
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Id } from "@/convex/_generated/dataModel";
import React, { useEffect, useRef, useState } from 'react';
import { CoachingExperts } from '@/services/CoachingOptions';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import RecordRTC from 'recordrtc';
import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
import { AIModel, getToken } from '@/services/GlobalServices';
import { Content } from 'next/font/google';

interface Expert {
    name: string;
    avtar: string;
}

const DiscussionRoom = () => {
    const { roomid } = useParams() as { roomid?: string };
    const [Expertinfo, setExpertinfo] = useState<Expert | null>(null);
    const [enableMic, setEnableMic] = useState(false);
    const realTimeTranscriber = useRef<RealtimeTranscriber | null>(null);
    const recorder = useRef<RecordRTC | null>(null);
    const silenceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [transcribe, setTranscribe] = useState<string>("");
    let texts: Record<number, string> = {};
    interface Message {
        role: string;
        content: string;
    }
    
    const [conversatation, setConversatation] = useState<Message[]>([]);
    

    const DiscussionRoomData = roomid
        ? useQuery(api.functions.Discussion.GetDiscussion, {
              id: roomid as Id<"Discussion">,
          })
        : null;

    console.log("Discussion data: ", DiscussionRoomData);

    useEffect(() => {
        if (DiscussionRoomData?.expertName) {
            const expert = CoachingExperts.find((e) => e.name === DiscussionRoomData.expertName);
            console.log("Expert", expert);
            setExpertinfo(expert || null);
        }
    }, [DiscussionRoomData]);

    const connectToServer = async () => {
        try {
            setEnableMic(true);

            // Initialize Assembly AI
            realTimeTranscriber.current = new RealtimeTranscriber({
                token: await getToken(),
                sampleRate: 16_000,
            });

            realTimeTranscriber.current.on('transcript',async (transcript) => {
                texts[transcript.audio_start] = transcript.text;
                let msg = "";
                if(transcript.message_type=='FinalTranscript'){
                    setConversatation(prev=>[...prev,{
                        role:'user',
                        content:transcript.text
                    }])

                    // calling Ai model text model to get ans
                    const aiResp=await AIModel(DiscussionRoomData?.topic!,DiscussionRoomData?.coachingOption!,transcript.text)
                    console.log(aiResp);
                    
                }
                const keys = Object.keys(texts).map(Number).sort((a, b) => a - b);
                setTranscribe(keys.map((key) => texts[key]).join(" "));
            });

            await realTimeTranscriber.current.connect();

            if (typeof window !== "undefined" && typeof navigator !== "undefined") {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                recorder.current = new RecordRTC(stream, {
                    type: 'audio',
                    mimeType: 'audio/webm;codecs=pcm',
                    recorderType: RecordRTC.StereoAudioRecorder,
                    timeSlice: 250,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                    bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: async (blob) => {
                        if (!realTimeTranscriber.current) return;
                        if (silenceTimeout.current) clearTimeout(silenceTimeout.current);
                        const buffer = await blob.arrayBuffer();
                        realTimeTranscriber.current.sendAudio(buffer);
                        silenceTimeout.current = setTimeout(() => {
                            console.log('User stopped talking');
                        }, 2000);
                    },
                });

                recorder.current.startRecording();
            }
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const disconnect = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (realTimeTranscriber.current) {
            await realTimeTranscriber.current.close();
            realTimeTranscriber.current = null;
        }

        if (recorder.current) {
            recorder.current.pauseRecording();
            recorder.current = null;
        }

        if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
            silenceTimeout.current = null;
        }

        setEnableMic(false);
    };

    return (
        <div>
            <h2 className='text-lg font-bold'>
                {DiscussionRoomData?.coachingOption}: {DiscussionRoomData?.topic}
            </h2>
            <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10 relative'>
                <div className='lg:col-span-2'>
                    <div className='h-[60vh] bg-gray-200 border rounded-4xl flex flex-col items-center justify-center relative'>
                        {Expertinfo && (
                            <div className="flex flex-col items-center">
                                <Image
                                    src={Expertinfo.avtar}
                                    alt={Expertinfo.name}
                                    width={100}
                                    height={100}
                                    className="h-[100px] w-[100px] rounded-full object-cover animate-pulse duration-[3000ms]"
                                />
                                <h2 className='text-gray-600 font-semibold mt-2 text-center'>{Expertinfo.name}</h2>
                            </div>
                        )}

                        {/* User Button - Positioned at Bottom Right */}
                        <div className='absolute bottom-4 right-4 bg-gray-300 p-10 rounded-xl shadow-md'>
                            <UserButton />
                        </div>
                    </div>

                    {/* Centered Connect Button */}
                    <div className='flex justify-center mt-5'>
                        {!enableMic ? (
                            <Button className='px-6 py-2 text-lg font-semibold' onClick={connectToServer}>
                                Connect
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={disconnect}>
                                Disconnect
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <div className='h-[60vh] bg-gray-200 border rounded-4xl flex flex-col items-center justify-center relative'>
                        <h2>Chat Section</h2>
                    </div>
                    <h2 className='text-sm text-gray-500 text-center mt-2 lg:col-span-3'>
                        At the end of the chat section, we will automatically generate the report/notes from your conversation.
                    </h2>
                </div>
            </div>
            <div>
                <h2>{transcribe}</h2>
            </div>
        </div>
    );
};

export default DiscussionRoom;
