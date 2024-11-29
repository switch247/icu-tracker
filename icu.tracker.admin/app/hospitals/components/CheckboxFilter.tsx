import React from "react";

interface CheckboxFilterProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function CheckboxFilter({ label, options, selected, onChange }: CheckboxFilterProps) {
    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div>
            <h3 className="font-semibold mb-2">{label}</h3>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selected.includes(option)}
                            onChange={() => toggleOption(option)}
                            className="cursor-pointer"
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    );
}
