import React from "react";
import { ChevronDown } from "lucide-react";

export default function Selector({
    label,
    value,
    onChange,
    options,
    placeholder = "Select"
}) {
    return (
        <div className="w-full">
            <p className="text-xs mb-1.5 text-[#989494] font-normal">{label}</p>
            <div className="relative w-full inline-block">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl border border-[#ececec] px-4.5 py-1.25
                               placeholder:text-[#989494] focus:shadow-sm hover:shadow-sm
                               appearance-none ease-in duration-75" 
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                    <ChevronDown className="h-4 w-4 text-[#989494]" />
                </div>
            </div>
        </div>
    )
}