import React from "react";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";

interface PropsInputLabel extends InputProps {
  label: string;
}
const InputLabel = React.forwardRef<HTMLInputElement, PropsInputLabel>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <>
        <div className="w-full">
          <Label className="text-sm" htmlFor={props.id}>
            {label}
          </Label>
          <Input type={type} ref={ref} {...props} className={className} />
        </div>
      </>
    );
  }
);
InputLabel.displayName = "Input";
export default InputLabel;
