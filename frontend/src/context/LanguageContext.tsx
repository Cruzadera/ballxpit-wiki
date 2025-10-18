import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLang = "es" | "en";

type LanguageContextValue = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = "lang";

function readInitialLanguage(): SupportedLang {
  if (typeof window === "undefined") {
    return "es";
  }

  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (stored === "es" || stored === "en") {
    return stored;
  }

  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(() => readInitialLanguage());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
