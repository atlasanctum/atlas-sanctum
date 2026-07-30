import React from "react";
import { AuthenticationPortal } from "@/components/auth/AuthenticationPortal";
import type { User } from "@/types/auth";

const AuthenticationPage: React.FC = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log('Authentication complete for user:', user);
    // Here you would typically redirect to the main dashboard
    // based on the user's role
  };

  return <AuthenticationPortal onComplete={handleComplete} />;
};

export default AuthenticationPage;
