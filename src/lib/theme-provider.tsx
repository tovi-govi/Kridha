import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const DEFAULT_STORAGE_KEY = "admin-theme";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({
  theme: "light",
  toggle: () => {},
});

function getStoredTheme(storageKey: string): Theme | null {
  if (typeof window === "undefined") return null;

  const storedTheme = localStorage.getItem(storageKey);

  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

export function ThemeProvider({
  children,
  storageKey = DEFAULT_STORAGE_KEY,
}: {
  children: ReactNode;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";

    return (
      getStoredTheme(storageKey) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  });

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [storageKey, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
