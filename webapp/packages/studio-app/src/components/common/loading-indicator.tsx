import React from "react";

const LoadingIndicator = () => {
  return (
      <div style={{
          height: "100%", width: "100%",
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
        }}
      >
        <span>Loading...</span>
      </div>
  );
}

export default LoadingIndicator;