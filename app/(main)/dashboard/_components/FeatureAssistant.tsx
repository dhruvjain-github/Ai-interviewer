"use client"
import { Button } from '@/components/ui/button'
import { Coachingclass } from '@/services/Options'
import { useUser } from '@stackframe/stack'
import Image from 'next/image'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import UserInputDialog from './UserInputDialog'
import ProfileDialog from './ProfileDialog'

// 1 error is pending

const FeatureAssistant = () => {
    const user = useUser()
    const [hydratedUser, setHydratedUser] = useState<string | null>(null)

    // Ensure hydration-safe user data
    useEffect(() => {
        setHydratedUser(user?.displayName || "Guest") // Fallback to prevent mismatch
    }, [user])

    return (
        <div>
            {/* Header Section */}
            <motion.div 
                className="flex flex-col md:flex-row justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h2 className="text-gray-600">My Workspace</h2>
                    <h2 className="md:text-2xl lg:text-3xl font-semibold">
                        Welcome back, {hydratedUser}
                    </h2>
                </div>
                <ProfileDialog>
                <Button className="mt-4 md:mt-0 font-semibold">Profile</Button>
                </ProfileDialog>
            </motion.div>

            {/* Expert List Section */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                {Coachingclass.map((e, index) => (
                    <motion.div 
                        key={index} 
                        className="flex flex-col items-center bg-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <UserInputDialog CoachingOptions={e}>
                        <div>
                        <Image 
                            src={e.icon} 
                            alt={e.name} 
                            height={80} 
                            width={80} 
                            className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] rounded-lg hover:rotate-12 hover:cursor-pointer transition-all duration-300"
                        />
                        <p className="text-center mt-2 text-sm md:text-base font-semibold">{e.name}</p>
                        </div>
                        </UserInputDialog>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistant
