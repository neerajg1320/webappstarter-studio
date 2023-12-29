export type ThemeType = "dark" | "light";

export interface Theme {
  "--primaryColor": Color;
  "--secondaryColor": Color;
  "--toastSuccessColor": Color;
  "--toastErrorColor": Color;
  "--shadowColor": Color;
  // '--'
}

export enum Color {
  BLACK = "#1A1110",
  LIGHT_BLACK = "#251f1f",
  WHITE = "#FFFFFF",
  BLUE = "#2b4172",
  OFFBLUE = "rgb(43 65 114 / 91%)",
  OFFWHITE = "rgb(255 255 255 / 81%)",
  OFFRED = "rgb(231 76 60 / 90%)",
  LIGHT_SHADOW = "rgb(114 114 114 / 22%)",
  DARK_SHADOW = "black"

}
