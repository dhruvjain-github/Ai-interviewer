"use client"
import React, { useEffect, useRef } from "react";

const ChatBox = ({ conversatation }: any) => {
    const chatRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom when messages update
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [conversatation]);

    return (
        <div>
            <div className="h-[60vh] bg-gray-200 border rounded-xl flex flex-col overflow-y-auto p-4" ref={chatRef}>
                {conversatation.map((item: any, index: number) => (
                    <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} my-2`}>
                        <div className={`p-3 max-w-[70%] rounded-xl shadow-md ${item.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`}>
                            {/* <p className="font-semibold">{item.role}</p> */}
                            <p>{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-sm text-gray-500 text-center mt-2">
                At the end of the chat, we will automatically generate the report/notes from your conversation.
            </h2>
        </div>
    );
};

export default ChatBox;
