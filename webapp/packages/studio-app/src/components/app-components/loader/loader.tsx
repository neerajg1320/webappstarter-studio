import React, { CSSProperties } from "react";
import "./loader.css"
import { useThemeContext } from "../../../context/ThemeContext/theme.context";

interface loaderProps {
    size: number;
    width: number;
}

const loader = ({size, width}: loaderProps)=>{
    const {theme} = useThemeContext();

    return (
        <div className="loaderBody" style={{...theme as CSSProperties}}>

            <div className="loaderCircle" style={{width: `${size}em`, borderWidth: `${width}em`, borderTopWidth: `${width}em`}}></div>
        </div>
    )
}

export default loader;