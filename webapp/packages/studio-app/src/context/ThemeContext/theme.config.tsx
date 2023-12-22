import { Color, Theme, ThemeType } from "./theme.model";


export const theme: Record<ThemeType, Theme> = {
  light: {
    // main color
    "--primaryColor": Color.BLUE,
    // commonly used
    "--secondaryColor": Color.WHITE,
  },
  dark: {
    "--primaryColor": Color.WHITE,
    "--secondaryColor": Color.BLACK,
  },
};
