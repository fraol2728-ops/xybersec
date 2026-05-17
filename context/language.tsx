"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

export type Language = "en" | "ar";

type LanguageContextValue = {
  lang: Language;
  setLang: (_lang: Language) => void;
  toggleLang: () => void;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  }, []);

  const value = useMemo(
    () => ({
      lang: "en" as const,
      setLang: () => {},
      toggleLang: () => {},
      isRTL: false,
    }),
    [],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
