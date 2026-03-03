import type { InputHTMLAttributes, ReactNode } from "react";
import "./Input.css";

type InputProps = {
  label?: string;
  helperText?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ label, helperText, id, className, ...rest }: InputProps) {
  const inputId = id ?? rest.name;

  const classes = ["crm-input", className].filter(Boolean).join(" ");

  return (
    <div className="crm-input-wrapper">
      {label && (
        <label className="crm-input-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={classes} {...rest} />
      {helperText && <p className="crm-input-helper">{helperText}</p>}
    </div>
  );
}

