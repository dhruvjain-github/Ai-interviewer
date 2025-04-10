"use client";
import { Button } from "@/components/ui/button";
import { AIModelToGenerateFeedbackAndNotes } from "@/services/GlobalServices";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { api } from '@/convex/_generated/api';
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel"; // Import Id type
import { toast } from "sonner";

const ChatBox = ({ conversatation, EnableFeedbackNotes, coachingOption }: any) => {
    const chatRef = useRef<HTMLDivElement>(null);
    const [Loading, setLoading] = useState(false);
    const updateSummery = useMutation(api.functions.Discussion.UpdateSummery);
    const { roomid } = useParams() as { roomid?: any };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversatation]);

    const GenerateFeedbackNotes = async () => {
        if (!roomid) {
            console.error("roomid is undefined, cannot update summary.");
            return;
        }
    
        try {
            setLoading(true);
    
            const result = await AIModelToGenerateFeedbackAndNotes(coachingOption, conversatation);
            // console.log("{ChatBox} Generated Feedback Notes:", result.content);
    
            await updateSummery({
                id: roomid as any, 
                summery: result.content,
            });
            setLoading(false);
            // console.log("{ChatBox} Summary updated successfully.");
            toast("Feedback/Notes generated successfully.");
        } catch (error) {
            setLoading(false);
            toast("Error generating feedback notes.");
            console.error("Error generating feedback notes:", error);
        } 
    };
    
    return (
        <div>
            <div className="h-[60vh] bg-gray-200 border rounded-xl flex flex-col overflow-y-auto p-4" ref={chatRef}>
                {conversatation.map((item: any, index: number) => (
                    <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} my-2`}>
                        <div className={`p-3 max-w-[70%] rounded-xl shadow-md ${item.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}>
                            <p>{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            {!EnableFeedbackNotes ? (
                <h2 className="text-sm text-gray-500 text-center mt-2">
                    At the end of the chat, we will automatically generate the report/notes from your conversation.
                </h2>
            ) : (
                <Button onClick={GenerateFeedbackNotes} disabled={Loading || !roomid} className="mt-4 w-full">
                    {Loading && <LoaderCircle className="animate-spin" />}
                    Generate Feedback/Notes
                </Button>
            )}
        </div>
    );
};

export default ChatBox;
