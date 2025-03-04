import { useContext, createContext, ReactNode, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setAppTheme: (theme: string) => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");
  const setAppTheme = (theme: string) => {
    setTheme(theme);
  };
  return (
    <ThemeContext.Provider value={{ theme, setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
