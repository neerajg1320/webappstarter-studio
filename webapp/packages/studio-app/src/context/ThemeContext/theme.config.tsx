import { Color, Theme, ThemeType } from "./theme.model";


export const theme: Record<ThemeType, Theme> = {
  light: {
    // main color
    "--primaryColor": Color.BLUE,
    // commonly used
    "--secondaryColor": Color.WHITE,
    "--toastErrorColor": Color.OFFRED,
    "--toastSuccessColor": Color.OFFBLUE
  },
  dark: {
    "--primaryColor": Color.WHITE,
    "--secondaryColor": Color.BLACK,
    "--toastErrorColor": Color.OFFRED,
    "--toastSuccessColor": Color.OFFWHITE
  },
};
