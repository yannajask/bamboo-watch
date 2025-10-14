import { Plus } from 'lucide-react'

export default function SelectorChips({
    label,
    selected,
    onChange,
    options

}) {
    const toggleValue = (value) => {
        let toggled;
        if (selected.includes(value)) {
            toggled = selected.filter((v) => v !== value);
        } else {
            toggled = [...selected, value];
        }
        if (onChange) onChange(toggled);
    };

    return (
        <div>
            <p className="text-xs mb-1.5 text-[#989494] font-normal">{label}</p>
            <div className="flex flex-row gap-2">
                {options.map((o) => {
                    const toggled = selected.includes(o.value);
                    return (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => toggleValue(o.value)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors duration-75 
                                       focus:outline-none hover:shadow-sm ease-in cursor-pointer
                                       ${toggled ? "bg-green-100" : "bg-[#ececec]"}`}
                        >
                            {o.label}
                            <span className={`transition-transform duration-75 ease-in-out transform-gpu
                                             ${toggled ? "rotate-45" : "rotate-0"}`}>
                                <Plus className="w-3 h-3"/>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
