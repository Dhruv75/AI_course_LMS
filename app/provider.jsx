"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useState, useEffect } from "react";

const Provider = ({ children }) => {
  const { user } = useUser();

  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/user", {
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
    });

    console.log("User created:", result.data);
    setUserDetails(result.data);
  };

  return (
    <UserDetailContext.Provider value={{userDetails, setUserDetails}}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
};

export default Provider;
