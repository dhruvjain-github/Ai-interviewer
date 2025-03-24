"use client"
import React, { ReactNode, useContext, useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { CoachingExperts } from "@/services/Options";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/app/_context/UserContext";


interface CoachingOption {
  name: string;
}

interface UserInputDialogProps {
  children: ReactNode;
  CoachingOptions: CoachingOption; 
}


const UserInputDialog: React.FC<UserInputDialogProps> = ({ children, CoachingOptions }) => {

    const [selectedExpert, setselectedExpert] = useState<string>("")
    const [Topic, setTopic] = useState<string>("")
    const createNewDisscussion = useMutation(api.functions.Discussion.CreateDiscussion)
    const [Loading, setLoading] = useState<boolean>(false)
    const [OpenDialog, setOpenDialog] = useState<boolean>(false)
    const router=useRouter()
    const { Userdata: userData } = useContext(UserContext);
    console.log("{UserInputDialog.tsx}Fetched user data:", userData);

    const OnclickNext = async () => {
      setLoading(true);
      
      if (!userData?._id) {
          console.error("User ID is missing!", userData);
          setLoading(false);
          return;
      }
  
      const result = await createNewDisscussion({
          coachingOption: CoachingOptions.name,
          topic: Topic,
          expertName: selectedExpert,
          uid: userData?._id, // Ensure this is not undefined
      });
  
      setLoading(false);
      setOpenDialog(false);
      console.log("User Input data", result);
      router.push(`/discussion-room/${result}`);
  };

  return (
    <Dialog open={OpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {CoachingOptions.name}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-4">
              {/* Topic Input Section */}
              <h2 className="text-gray-800 font-semibold text-lg">
                Enter a topic to master your skills in {CoachingOptions.name}
              </h2>
              <Textarea 
                placeholder="Enter your Topic" 
                className="mt-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                onChange={(e) => setTopic(e.target.value)}
              />

              {/* Expert Selection Section */}
              <h2 className="text-gray-800 font-semibold text-lg mt-8">
                Select an Expert for {CoachingOptions.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {CoachingExperts.map((expert, index) => (
                  <div 
                    onClick={() => setselectedExpert(expert.name)}
                    key={index} 
                    className="p-4 rounded-lg hover:cursor-pointer hover:bg-gray-200 transition-transform hover:scale-105 flex flex-col items-center"
                  >
                    <Image 
                      src={expert.avtar} 
                      alt={expert.name} 
                      height={100} 
                      width={100}
                      className={`rounded-2xl object-cover h-[100px] w-[120px] ${selectedExpert === expert.name ? 'border-2 border-blue-500' : ''}`}
                    />
                    <h2 className="text-black font-semibold mt-2 text-center">
                      {expert.name}
                    </h2>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-5 gap-3">
                <DialogClose asChild>
                <Button variant={'ghost'} className="hover:cursor-pointer hover:bg-gray-200">Cancel</Button>
                </DialogClose>
                
                <Button className="font-semibold hover:cursor-pointer" disabled={(!Topic||!selectedExpert||Loading)} onClick={OnclickNext}>
                    {Loading&& <LoaderCircle className="animate-spin"/>}
                    Next
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
