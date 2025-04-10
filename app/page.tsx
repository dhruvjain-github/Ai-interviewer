'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-white text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <span className="inline-flex items-center bg-pink-100 text-pink-600 text-sm px-4 py-1 rounded-full shadow-sm">
          ✨ Introducing Magic UI →
        </span>
      </motion.div>

      {/* Hero Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4"
      >
        Revolutionize Learning with <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400">
          AI-Powered Voice Agent
        </span>{" "}
        🎙️📚
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-lg text-gray-600 max-w-2xl mb-6"
      >
        Enhance your learning experience with real-time transcription, dynamic AI-generated notes, and voice interaction powered by state-of-the-art technology.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4 }}
      >
        <Button
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-all text-lg"
          onClick={() => router.push("/dashboard")}
        >
          Get Started!
        </Button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mt-16 max-w-4xl text-left"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features:</h2>
        <ul className="text-gray-600 list-disc list-inside space-y-2">
          <li>🎤 Real-time transcription and voice-to-text conversion</li>
          <li>🗣️ Text-to-speech synthesis using AWS Polly</li>
          <li>🧠 Seamless integration with AssemblyAI for high-quality transcription</li>
          <li>📄 Dynamic feedback and note generation powered by AI models</li>
          <li>🔐 Secure user authentication and session management</li>
        </ul>
      </motion.div>
    </div>
  );
}
