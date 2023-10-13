import React, {KeyboardEventHandler, useEffect, useRef, useState, FocusEvent, FocusEventHandler} from "react";
import {debugComponent} from "../../config/global";
import {withLifecyleLogger} from "../../hoc/logger";

interface EditableSpanPropsOptions {
  blurOnEnterPressOnly?: boolean;
}

interface EditableSpanProps {
  value: string;
  onChange?: (v:string) => void;
  mode?: boolean;
  onModeChange?: (isEditing:boolean) => void;
  opts?: EditableSpanPropsOptions;
  renderCount ?: number;
  onBlur ?: FocusEventHandler<HTMLInputElement> ;
}

const defaultOpts:EditableSpanPropsOptions = {
  blurOnEnterPressOnly: false,
}

const EditableSpan:React.FC<EditableSpanProps> = ({
                                                    value:editedValue,
                                                    onChange:propOnChange,
                                                    mode=false,
                                                    onModeChange,
                                                    opts=defaultOpts,
                                                    renderCount,
                                                    onBlur: propOnBlur,

}) => {
  const [editEnabled, setEditEnabled] = useState(mode);
  const [blurCauseKeyDown, setBlurCauseKeyDown] = useState<boolean>(false);
  const targetRef = useRef<EventTarget & HTMLInputElement>();

  if (debugComponent) {
    console.log(`EditableSpan: rendered: value=${editedValue} mode:${mode} editEnabled:${editEnabled}`, opts);
  }

  useEffect(() => {
    setEditEnabled(mode);
  }, [mode]);


  const handleDoubleClick = () => {
    setEditEnabled(true);
  }

  const handleInputKeyPress:KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (debugComponent) {
      console.log(e.key);
    }

    if (e.key === "Enter") {
      if (opts?.blurOnEnterPressOnly) {
        setBlurCauseKeyDown(true);
        targetRef.current = e.currentTarget;

        // Here we blur after a timeout
        setTimeout(() => {
          if (targetRef.current) {
            targetRef.current.blur();
          }
        }, 0);
      } else {
        // Here we directly blur
        e.currentTarget.blur();
      }
    }
  }

  const handleInputBlur:FocusEventHandler<HTMLInputElement> = (e) => {
    // console.log(`EditableSpanProps:handleInputBlur() editedValue:${editedValue}`);

    if(opts?.blurOnEnterPressOnly) {
      if (blurCauseKeyDown) {
        setEditEnabled(false);
        setBlurCauseKeyDown(false);
      }
    } else {
      setEditEnabled(false);
    }

    if (propOnBlur) {
      propOnBlur(e);
    }
  }

  useEffect(() => {
    if (onModeChange) {
      onModeChange(editEnabled);
    }
  }, [editEnabled]);

  const handleInputFocus = (e) => {
    const value = e.target.value;
    const dotPosition = value.indexOf('.');
    console.log(`handleInputFocus: value=${value} dotPosition:${dotPosition}`);

    e.target.selectionStart = 0;
    e.target.selectionEnd= dotPosition;
  }

  return (
      <div onDoubleClick={handleDoubleClick} >
        {editEnabled ?
            <input
                autoFocus
                value={editedValue}
                onChange={(e:any) => propOnChange(e.target.value)}
                onKeyDownCapture={handleInputKeyPress}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
            />
            :
            <span>{editedValue}</span>
        }
      </div>
  );
}

export default EditableSpan;