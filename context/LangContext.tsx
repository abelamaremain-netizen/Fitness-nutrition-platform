"use client";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Lang, type TranslationKey, t as translate } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Persist to localStorage so it survives page refresh
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(lang, key),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
