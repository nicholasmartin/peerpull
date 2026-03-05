"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

type TextSizeType = "sm" | "md" | "lg";

type TextSizeContextType = {
  textSize: TextSizeType;
  setTextSize: (size: TextSizeType) => void;
};

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

const textSizeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('textSize');
      var size = (stored === 'sm' || stored === 'md' || stored === 'lg') ? stored : 'md';
      document.documentElement.setAttribute('data-text-size', size);
    } catch (e) {}
  })();
`;

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSizeState] = useState<TextSizeType>("md");

  useEffect(() => {
    const stored = localStorage.getItem("textSize");
    if (stored === "sm" || stored === "md" || stored === "lg") {
      setTextSizeState(stored);
    }
  }, []);

  const setTextSize = (size: TextSizeType) => {
    setTextSizeState(size);
    document.documentElement.setAttribute("data-text-size", size);
    localStorage.setItem("textSize", size);
  };

  return (
    <>
      <Script id="text-size-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: textSizeScript }} />
      <TextSizeContext.Provider value={{ textSize, setTextSize }}>
        {children}
      </TextSizeContext.Provider>
    </>
  );
};

export const useTextSize = () => {
  const context = useContext(TextSizeContext);
  if (context === undefined) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
};
