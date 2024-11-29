import React from "react";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function RangeSlider({ label, min, max, value, onChange }: RangeSliderProps) {

  return (
    <div>
      <h3 className="font-semibold mb-2">{label}</h3>
      <div className="flex items-center justify-between text-sm mb-2">
        <span>min</span>
        <span>max</span>
      </div>
      <div className="flex space-x-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([+e.target.value, value[1]])}
          className="w-full p-1 border border-gray-300 rounded"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], +e.target.value])}
          className="w-full p-1 border border-gray-300 rounded"
        />
      </div>

    </div>
  );
}
