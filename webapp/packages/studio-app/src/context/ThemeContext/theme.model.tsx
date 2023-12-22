export type ThemeType = "dark" | "light";

export interface Theme {
  "--primaryColor": Color;
  "--secondaryColor": Color;
  // '--'
}

export enum Color {
  BLACK = "#000000",
  LIGHT_BLACK = "#251f1f",
  WHITE = "#FFFFFF",
  BLUE = "#2b4172",
}
