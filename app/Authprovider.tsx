"use client";
import { useUser } from '@stackframe/stack'
import { useMutation } from 'convex/react'
import React, { useEffect, useState } from 'react'
import {api} from '@/convex/_generated/api'
import { UserContext } from './_context/UserContext';

const Authprovider = ({children}:any) => {

    const [Userdata, setUserdata] = useState<any>(undefined)
    const user=useUser()
    const CreateUser=useMutation(api.functions.user.CreateUser)

    useEffect(()=>{

        // console.log(user);
        user && CreateNewUser()
        
    },[user])

    const CreateNewUser = async () => {
        if (!user?.primaryEmail) {
          console.error("User email is missing");
          return;
        }

        try {
          const result = await CreateUser({
            name: user.displayName || "Unknown", // Default to "Unknown" if name is null
            email: user.primaryEmail, // Guaranteed to be a string
          });
          setUserdata(result);
        } catch (error) {
          console.error("Error creating user:", error);
        }
      };

  return (
    <div>
        <UserContext.Provider value={{Userdata, setUserdata}}>
            {children}
        </UserContext.Provider>
        
    </div>
  )
}

export default Authprovider