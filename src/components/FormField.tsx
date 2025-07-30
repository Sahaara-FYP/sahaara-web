// src/components/ui/form-field.tsx
import { Input } from "@/components/ui/input";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const FormField = ({
  label,
  id,
  placeholder,
  type = "text",
  registration,
  error,
}: FormFieldProps) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block mb-1 font-medium">
        {label}
      </label>
      <Input id={id} type={type} placeholder={placeholder} {...registration} />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormField;
