import React, {useRef, useState} from "react";
import {debugComponent} from "../../config/global";

interface EditableSpanPropsOptions {
  blurOnEnterPressOnly?: boolean;
}

interface EditableSpanProps {
  value: string;
  onChange?: (v:string) => void;
  opts?: EditableSpanPropsOptions;
}

const defaultOpts:EditableSpanPropsOptions = {
  blurOnEnterPressOnly: false,
}

const EditableSpan:React.FC<EditableSpanProps> = ({
                                                    value:initialValue,
                                                    onChange:propOnChange,
                                                    opts=defaultOpts,
}) => {
  const [editEnabled, setEditEnabled] = useState(false);
  const [editedValue, setEditedValue] = useState<string>(initialValue);
  const [blurCauseKeyDown, setBlurCauseKeyDown] = useState<boolean>(false);
  const targetRef = useRef<any>();

  const handleDoubleClick = () => {
    setEditEnabled(true);
  }

  const handleInputKeyPress:React.KeyboardEventHandler<HTMLInputElement> = (e) => {

    if (debugComponent) {
      console.log(e.key);
    }

    if (e.key === "Enter") {
      if (opts?.blurOnEnterPressOnly) {
        setBlurCauseKeyDown(true);
        targetRef.current = e.currentTarget;

        setTimeout(() => {
          targetRef.current.blur();
        }, 0);
      } else {
        e.currentTarget.blur();
      }
    }
  }

  const handleInputBlur = () => {
    if (propOnChange) {
      propOnChange(editedValue);
    }

    if(opts?.blurOnEnterPressOnly) {
      if (blurCauseKeyDown) {
        setEditEnabled(false);
        setBlurCauseKeyDown(false);
      }
    } else {
      setEditEnabled(false);
    }
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