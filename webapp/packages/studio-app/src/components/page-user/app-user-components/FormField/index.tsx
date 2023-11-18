import { useState, useRef } from "react";
import { formFieldPropTypes } from "../../../../types/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormField = ({
  fieldName,
  fieldType,
  fieldValue,
  labelName,
  handleInputChange,
  // setFormData,
  // formData,
  required,
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
    <label className="form-label-field">
      <div style={{textAlign: 'left'}}>
        {labelName}
        {required && <span className="form-required-field">*</span>}
      </div>
      <div
        className="form-input-box"
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      >
        <input
          type={
            passwordFieldName.includes(fieldName) ? fieldPassword : fieldType
          }
          name={fieldName}
          value={fieldValue}
          onChange={(e)=>handleInputChange(fieldName, e.target.value)}
          required={required}
        />
        {passwordFieldName.includes(fieldName) &&
          (fieldPassword === "text" ? (
            <span onClick={handlePasswordField}>
              <FaEye size="22" />
            </span>
          ) : (
            <span onClick={handlePasswordField}>
              <FaEyeSlash size="22" />
            </span>
          ))}
      </div>

      <div className="border" ref={ref}></div>
    </label>
  );
};

export default FormField;
