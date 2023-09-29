import React from "react";

interface CodeFallbackEditorProps {
  value: string,
  onChange?: (v:string) => void
}

const CodeFallbackEditor:React.FC<CodeFallbackEditorProps> = ({value, onChange:propOnChange}) => {
  return (
      <>
        <textarea
            value={value}
            onChange={
              (e) => {
                if (propOnChange) {
                  propOnChange(e.target.value)
                }
              }
            }
            style={{height: "100%", width: "100%", fontSize: "1.2em", padding:"5px"}}
        />
      </>
  )
}

export default CodeFallbackEditor;