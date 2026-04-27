import React from "react";
import "../../App.css";

type Props = {
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
};

const FieldGroup: React.FC<Props> = ({ label, required, helperText, children }) => {
  return (
    <div className="field-group">
      <label className="field-label">
        {required && <span className="field-required">*</span>}
        {label}
      </label>
      {children}
      {helperText && <div className="field-helper">{helperText}</div>}
    </div>
  );
};

export default FieldGroup;
