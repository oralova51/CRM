import type { InputHTMLAttributes } from "react";
import "./FormInput.css";

type FormInputProps = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = ({ label, value, ...otherProps }: FormInputProps) => {
  const hasValue =
    typeof value === "string"
      ? value.length > 0
      : typeof value === "number"
        ? !Number.isNaN(value)
        : Boolean(value);

  const inputLabelClassName = hasValue
    ? "shrink form-input-label"
    : "form-input-label";

  return (
    <div className="group">
      <input
        className="form-input"
        {...otherProps}
        value={value}
        autoComplete="off"
      />
      {label && (
        <label className={inputLabelClassName} htmlFor={otherProps.name}>
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
