import React, {useState} from "react";
import {debugComponent} from "../../config/global";

interface EditableSpanProps {
  value: string;
  onChange?: (v:string) => void;
}

const EditableSpan:React.FC<EditableSpanProps> = ({value:initialValue, onChange:propOnChange}) => {
  const [editEnabled, setEditEnabled] = useState(false);
  const [editedValue, setEditedValue] = useState<string>(initialValue);

  const handleDoubleClick = () => {
    setEditEnabled(true);
  }

  const handleInputKeyPress:React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (debugComponent) {
      console.log(e.key);
    }

    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  const handleInputBlur = () => {
    if (propOnChange) {
      propOnChange(editedValue);
    }

    setEditEnabled(false);
  }

  return (
      <div onDoubleClick={handleDoubleClick} >
        {editEnabled ?
            <input
                autoFocus
                value={editedValue}
                onChange={(e:any) => setEditedValue(e.target.value)}
                onKeyDownCapture={handleInputKeyPress}
                onBlur={handleInputBlur}
            />
            :
            <span>{editedValue}</span>
        }
      </div>
  );
}

export default EditableSpan;