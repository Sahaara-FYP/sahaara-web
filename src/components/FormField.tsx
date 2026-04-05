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
    <div className="w-full space-y-2.5">
      <label
        htmlFor={id}
        className="block font-semibold text-[13px] text-white/70 uppercase tracking-widest ml-1"
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/30 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 text-[15px] px-5 transition-all shadow-sm"
      />
      {error && (
        <p className="text-rose-400 font-medium text-[13px] mt-1.5 ml-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormField;
