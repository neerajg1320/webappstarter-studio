import React from "react";
import "./loader.css"

interface loaderProps {
    size: number;
    width: number;
}

const loader = ({size, width}: loaderProps)=>{

    return (
        <div className="loaderBody">

            <div className="loaderCircle" style={{width: `${size}em`, borderWidth: `${width}em`, borderTopWidth: `${width}em`}}></div>
        </div>
    )
}

export default loader;