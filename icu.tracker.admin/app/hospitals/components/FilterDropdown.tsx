import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterDropdownProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All {label}</SelectItem>
                {options.length > 0
                    ? options.map((option, idx) => (
                        <SelectItem key={option} value={option ?? idx.toString()}>
                            {option}
                        </SelectItem>
                    ))
                    : null}
            </SelectContent>
        </Select>
    );
}
