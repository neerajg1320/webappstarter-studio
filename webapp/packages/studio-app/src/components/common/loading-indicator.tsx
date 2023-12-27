import React, { CSSProperties } from "react";
import Loader from "../app-components/loader/loader"
import { useThemeContext } from "../../context/ThemeContext/theme.context";

const LoadingIndicator = () => {
  const {theme} = useThemeContext();
  return (
      <div style={{
          ...theme as CSSProperties
        }}
      >
        <Loader size={5} width={0.4}/>
      </div>
  );
}

export default LoadingIndicator;