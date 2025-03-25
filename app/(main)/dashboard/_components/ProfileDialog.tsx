import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Credits from './Credits'
  
const ProfileDialog = ({children}:any) => {
  return (
    <Dialog>
    <DialogTrigger asChild >{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle></DialogTitle>
        <DialogDescription>
          <Credits/>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  
  )
}

export default ProfileDialog