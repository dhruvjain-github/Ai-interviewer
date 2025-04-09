"use client";
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { Id } from "@/convex/_generated/dataModel";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CoachingExperts } from '@/services/Options';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import RecordRTC from 'recordrtc';
import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
import { AIModel, ConvertTextToSpeech, getToken } from '@/services/GlobalServices';
import { Loader2Icon } from 'lucide-react';
import ChatBox from './_components/ChatBox';
import { UserContext } from '@/app/_context/UserContext';
import Webcam from "react-webcam";
interface Expert {
    name: string;
    avtar: string;
}

interface Message {
    role: string;
    content: string;
}

const DiscussionRoom = () => {
    const { roomid } = useParams() as { roomid?: string };
    const { userData, setUserData } = useContext(UserContext);
    const [Expertinfo, setExpertinfo] = useState<Expert | null>(null);
    const [enableMic, setEnableMic] = useState(false);
    const realTimeTranscriber = useRef<RealtimeTranscriber | null>(null);
    const recorder = useRef<RecordRTC | null>(null);
    const silenceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [Loading, setLoading] = useState<boolean>(false);
    const [transcribe, setTranscribe] = useState<string>("");
    const [audiourl, setAudiourl] = useState<string | null>(null); // Fix type error
    const UpdateConversation = useMutation(api.functions.Discussion.UpdateConversation);
    const [EnableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
    const updateUserToken = useMutation(api.functions.user.UpdateUserToken);
    const [showWebcam, setShowWebcam] = useState(true);
    let texts: Record<number, string> = {};

    const [conversatation, setConversatation] = useState<Message[]>([
        { role: "assistant", content: "Hello, I am your AI assistant. To begin press Connect & tell me about yourself." },
    ]);

    const DiscussionRoomData = roomid
        ? useQuery(api.functions.Discussion.GetDiscussion, {
              id: roomid as Id<"Discussion">,
          })
        : null;

    useEffect(() => {
        if (!DiscussionRoomData) return;

        if (DiscussionRoomData.expertName) {
            const expert = CoachingExperts.find((e) => e.name === DiscussionRoomData.expertName);
            setExpertinfo(expert || null);
        }
    }, [DiscussionRoomData]);

    useEffect(() => {
        async function fetchData() {
            if (!DiscussionRoomData || conversatation.length === 0 || conversatation[conversatation.length - 1]?.role !== "user") return;

            if (!DiscussionRoomData || conversatation[conversatation.length - 1].role !== "user") return;

            const LastTwoMessages = conversatation.slice(-2);
            const aiResp = await AIModel(
                DiscussionRoomData.topic,
                DiscussionRoomData.coachingOption,
                LastTwoMessages
            );

            console.log("AI Response:", aiResp);

            const voiceId = DiscussionRoomData.expertName as "Joanna" | "Ruth" | "Matthew"; 
            const url = await ConvertTextToSpeech(aiResp.content, voiceId);
            console.log("URL", url);
            
            setAudiourl(url);
            setConversatation((prev) => [...prev, aiResp]);
            await updateUserTokenMethod(aiResp.content); //update AI generated token
        }

        fetchData();
    }, [conversatation, DiscussionRoomData]);

    const connectToServer = async () => {
        setLoading(true);
        try {
            setEnableMic(true);

            realTimeTranscriber.current = new RealtimeTranscriber({
                token: await getToken(),
                sampleRate: 16_000,
            });

            realTimeTranscriber.current.on("transcript", async (transcript) => {
                texts[transcript.audio_start] = transcript.text;

                if (transcript.message_type === "FinalTranscript") {
                    setConversatation((prev) => [...prev, { role: "user", content: transcript.text }]);
                    await updateUserTokenMethod(transcript.text); //update user generated token
                }

                const keys = Object.keys(texts).map(Number).sort((a, b) => a - b);
                setTranscribe(keys.map((key) => texts[key]).join(" "));
            });

            await realTimeTranscriber.current.connect();
            setLoading(false);

            if (typeof window !== "undefined" && typeof navigator !== "undefined") {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                recorder.current = new RecordRTC(stream, {
                    type: "audio",
                    mimeType: "audio/webm;codecs=pcm",
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
                            console.log("User stopped talking");
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
        setLoading(true);

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

        if (DiscussionRoomData) {
            console.log("DiscussionRoomData before update:", DiscussionRoomData);

            await UpdateConversation({
                id: DiscussionRoomData._id,
                conversation: conversatation
            });
        }
        setLoading(false);
        setEnableFeedbackNotes(true);
    };

    const updateUserTokenMethod = async (text: string) => {
        const tokenCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const result = await updateUserToken({
            id: userData._id,
            credits: Number(userData.credits) - Number(tokenCount)
        });
        setUserData((prev: any) => ({
            ...prev,
            credits: Number(userData.credits) - Number(tokenCount)
        }));
    };

    return (
        <div>
            <h2 className="text-lg font-bold">
                {DiscussionRoomData?.coachingOption}: {DiscussionRoomData?.topic}
            </h2>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
                <div className="lg:col-span-2">
                    <div className="h-[60vh] bg-gray-200 border rounded-4xl flex flex-col items-center justify-center relative">
                        {Expertinfo && (
                            <div className="flex flex-col items-center">
                                <Image
                                    src={Expertinfo.avtar}
                                    alt={Expertinfo.name}
                                    width={100}
                                    height={100}
                                    className="h-[100px] w-[100px] rounded-full object-cover animate-pulse duration-[3000ms]"
                                />
                                <h2 className="text-gray-600 font-semibold mt-2 text-center">{Expertinfo.name}</h2>
                            </div>
                        )}
                        {audiourl && <audio src={audiourl} autoPlay />}

                        <div className="absolute bottom-4 right-4 bg-gray-300  rounded-xl shadow-md h-[200px] w-[200px] flex items-center justify-center">
                            {showWebcam ? (
                                <Webcam 
                                    className="rounded-xl h-full w-full object-cover" 
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <UserButton />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-5">
                        <Button
                            className="px-4 py-2 mr-4"
                            onClick={() => setShowWebcam((prev) => !prev)}
                        >
                            {showWebcam ? "Disable Camera" : "Enable Camera"}
                        </Button>
                        {!enableMic ? (
                            <Button className="px-6 py-2 text-lg font-semibold" onClick={connectToServer} disabled={Loading}>
                                {Loading && <Loader2Icon className="animate-spin" />}Connect
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={disconnect}>
                                {Loading && <Loader2Icon className="animate-spin" />}Disconnect
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <ChatBox 
                    conversatation={conversatation}
                    EnableFeedbackNotes={EnableFeedbackNotes}
                    coachingOption={DiscussionRoomData?.coachingOption} />
                </div>
            </div>
            <div>
                <h2>{transcribe}</h2>
            </div>
        </div>
    );
};

export default DiscussionRoom;
