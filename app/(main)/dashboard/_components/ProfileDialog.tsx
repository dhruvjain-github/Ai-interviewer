'use client'

import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Credits from './Credits'

interface ProfileDialogProps {
  children: ReactNode
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ children }) => {
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 mb-2">Your Profile</DialogTitle>
          <DialogDescription asChild>
            <Credits />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog
