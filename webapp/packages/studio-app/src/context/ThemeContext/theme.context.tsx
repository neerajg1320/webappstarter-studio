import { createContext, useContext, useState } from "react";
import { theme } from "./theme.config";
import { ThemeType, Theme } from "./theme.model";

type defaultContext = {
  currentTheme: ThemeType;
  theme: Theme;
  setCurrentTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
};

const themeContext = createContext<defaultContext>({
  currentTheme: "light",
  theme: theme["light"],
} as defaultContext);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>("light");
  return (
    <themeContext.Provider
      value={{ currentTheme, theme: theme[currentTheme], setCurrentTheme }}
    >
      {children}
    </themeContext.Provider>
  );
};

export default ThemeContextProvider;

export const useThemeContext = () => useContext(themeContext);
