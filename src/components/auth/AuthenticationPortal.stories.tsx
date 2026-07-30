import React from "react";
import { AuthenticationPortal } from "./AuthenticationPortal";
import type { User } from "@/types/auth";

export default {
  title: "Authentication/AuthenticationPortal",
  component: AuthenticationPortal,
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log("Authentication complete:", user);
  };
  return <AuthenticationPortal onComplete={handleComplete} />;
};

export const ProducerFlow = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log("Producer authentication complete:", user);
  };
  return <AuthenticationPortal onComplete={handleComplete} />;
};

export const InvestorFlow = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log("Investor authentication complete:", user);
  };
  return <AuthenticationPortal onComplete={handleComplete} />;
};

export const InstitutionFlow = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log("Institution authentication complete:", user);
  };
  return <AuthenticationPortal onComplete={handleComplete} />;
};

export const KnowledgeBuilderFlow = () => {
  const handleComplete = (user: Partial<User>) => {
    console.log("Knowledge builder authentication complete:", user);
  };
  return <AuthenticationPortal onComplete={handleComplete} />;
};
