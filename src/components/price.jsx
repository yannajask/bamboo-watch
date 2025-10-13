export default function PriceSelector({
    label,
    value,
    onChange,
    placeholder = "None"
}) {
    return (
        <div className="w-full">
            <p className="text-xs mb-1.5 text-[#989494] font-normal">{label}</p>
            <div className="w-full relative inline-block">
            <input
                type="number"
                min="0"
                step="50"
                max="5000"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#ececec] px-4.5 py-1.25 text-transparent focus:outline-none
                          placeholder:text-[#989494] focus:shadow-sm hover:shadow-sm ease-in duration-75" 
            />
            <span className="absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {value ? `$${Number(value).toLocaleString()} per month` : ""}
            </span>
            </div>
        </div>
    )
}

