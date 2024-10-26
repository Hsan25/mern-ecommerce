import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Props {
  onValueChange?: (val: string) => void;
  items: { name: string; value: string }[];
  defaultValue?: string;
  placeholder: string;
  name?: string;
  label: string;
  current?: string;
}

const SelectCustom = ({
  current,
  name,
  placeholder,
  defaultValue,
  onValueChange,
  label,
  items,
  ...props
}: Props) => {
  return (
    <>
      <Select {...props} name={name} onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map((item, idx) => (
              <SelectItem defaultChecked={current == item.value} key={idx} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectCustom;
