"use client";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { UserContext } from "./_context/UserContext";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<any>(null);
  const user = useUser();
  const createUser = useMutation(api.functions.user.CreateUser);

  useEffect(() => {
    if (user) {
      createNewUser();
    }
  }, [user]);

  const createNewUser = async () => {
    if (!user?.primaryEmail) {
      console.error("User email is missing");
      return;
    }

    try {
      const result = await createUser({
        name: user.displayName || "Unknown",
        email: user.primaryEmail,
      });
      setUserData(result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;
