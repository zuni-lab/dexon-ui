"use client";
import { Suspense } from "react";

import BackgroundWrapper from "@/components/BackgroundWrapper";
import { Footer } from "@/components/Footer";
import Header from "../components/Header";
import { Authentication } from "./Authentication";

export const WrapperLayout: IComponent = ({ children }) => {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center space-y-4 px-16 pt-8 pb-4 text-white">
      <Suspense>
        <Authentication />
      </Suspense>
      <Header />
      <div className="flex w-full flex-1 flex-col">{children}</div>
      <Footer />
      <BackgroundWrapper />
    </div>
  );
};
