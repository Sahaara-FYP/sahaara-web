/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFilterPropTypes {
  items: Record<string, string>;
  placeholder?: string;
  label: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<unknown>>;
}

const SelectFilter = ({
  items,
  placeholder,
  value,
  setValue,
  label,
}: SelectFilterPropTypes) => {
  return (
    <div>
      <Select
        value={value}
        onValueChange={(val) => {
          setValue((prev: any) => ({ ...prev, [label]: val }));
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={placeholder || "Select"} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(items).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
