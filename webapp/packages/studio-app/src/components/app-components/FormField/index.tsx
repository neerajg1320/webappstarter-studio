import { useState, useRef, useEffect } from "react";
import { formFieldPropTypes } from "../../../types/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormField = ({
  fieldName,
  fieldType,
  fieldValue,
  labelName,
  handleInputChange,
  box = "input",
  // setFormData,
  // formData,
  required,
  fieldDefaultChecked
}: formFieldPropTypes) => {
  // const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  // setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const passwordFieldName = [
    "password",
    "password1",
    "password2",
    "new_Password1",
    "new_Password2",
    "old_Password",
  ];

  const [fieldPassword, setFieldPassword] = useState("password");
  const ref = useRef<HTMLDivElement | null>(null);

  const onInputFocus = () => {
    if (ref && ref.current) ref.current.classList.add("inputBorderAnimation");
  };

  const onInputBlur = () => {
    if (ref && ref.current)
      ref.current.classList.remove("inputBorderAnimation");
  };

  const handlePasswordField = () => {
    if (fieldPassword === "password") {
      setFieldPassword("text");
    } else {
      setFieldPassword("password");
    }
  };

  return (
    <label
      className={`form-label-field ${
        fieldType === "radio" ? "form-label-radio-field" : ""
      }`}
    >
      <div style={{ textAlign: "left" }}>
        {labelName}
        {required && <span className="form-required-field">*</span>}
      </div>
      <div
        className="form-input-box"
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      >
        {box === "input" ? (
          <input
            type={
              passwordFieldName.includes(fieldName) ? fieldPassword : fieldType
            }
            name={fieldName}
            value={fieldValue}
            onChange={(e) =>
              handleInputChange(
                fieldType !== "radio" ? fieldName : labelName,
                e.target.value
              )
            }
            defaultChecked={fieldDefaultChecked}
            // onClick={(e)=>handleInputClick(labelName)}
            //  ref={inputRef}
            required={required}
          />
          
        ) : (
          <textarea
            name={fieldName}
            value={fieldValue}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            rows={8}
          />
        )}
        {fieldType=="radio" &&  <span className="custom-radio"></span>}
        {passwordFieldName.includes(fieldName) &&
          (fieldPassword === "text" ? (
            <span
              onClick={handlePasswordField}
              style={{ display: "flex", height: "15px" }}
            >
              <FaEye size="22" />
            </span>
          ) : (
            <span
              onClick={handlePasswordField}
              style={{ display: "flex", height: "15px" }}
            >
              <FaEyeSlash size="22" />
            </span>
          ))}
      </div>

      {fieldType !== "radio" && <div className="border" ref={ref}></div>}
    </label>
  );
};

export default FormField;