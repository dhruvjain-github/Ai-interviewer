'use client'

import { UserContext } from '@/app/_context/UserContext'
import { useUser } from '@stackframe/stack'
import Image from 'next/image'
import React, { useContext } from 'react'
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button'

const Credits: React.FC = () => {
  const { userData } = useContext(UserContext)
  const user = useUser()
  const profileImageUrl = user?.profileImageUrl || '/default-profile.png'

  const usedTokens = 30000
  const totalTokens = 50000
  const usagePercent = (usedTokens / totalTokens) * 100

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-xl p-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg">
        <div className="flex gap-6 items-center">
          <Image
            src={profileImageUrl}
            alt="Profile Image"
            width={70}
            height={70}
            className="rounded-full border-4 border-blue-300 shadow-md"
          />
          <div>
            <div className="text-xl font-bold text-white">{user?.displayName || userData?.name || 'Guest'}</div>
            <p className="text-sm text-white">{user?.primaryEmail || userData?.email}</p>
          </div>
        </div>
        <hr className="my-4 border-gray-300" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Token Usage</h2>
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium text-gray-700">Used: {usedTokens.toLocaleString()}</h2>
            <h2 className="text-sm font-medium text-gray-700">Total: {totalTokens.toLocaleString()}</h2>
          </div>
          <Progress value={usagePercent} className="h-3 rounded-full bg-gray-200" />
          <p className="text-xs text-gray-500 mt-3">{usagePercent.toFixed(0)}% of your tokens have been used.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="font-bold text-gray-800">Current Plan</h2>
        <h2 className="font-bold p-2 bg-blue-200 rounded-lg text-blue-800 px-4 shadow-sm">Free</h2>
      </div>

      <div className="mt-6 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800">Pro Plan</h2>
            <h2 className="text-sm text-gray-600">50,000 Tokens</h2>
          </div>
          <h2 className="text-lg font-bold text-blue-800">$10/Month</h2>
        </div>
        <Button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          Upgrade to Pro
        </Button>
      </div>
    </div>
  )
}

export default Credits
