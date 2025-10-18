import Selector from "../components/selector";
import PriceSelector from "../components/price";
import SelectorChips from "../components/chips";
import { Check } from "lucide-react";

export default function SettingsPage({
    config,
    isDirty,
    isSaved,
    changeHandler,
    saveConfigHandler,
}) {
    // change classes for save button depending on state
    const saveButtonClasses = () => {
        const base = "rounded-xl h-9 px-1.75 ease-in duration-75 transition-colors";
        if (isSaved) {
            return `bg-green-200 text-white ${base}`;
        } else if (isDirty) {
            return `bg-black text-white hover:opacity-90 ${base} hover:shadow-md cursor-pointer`;
        } else return `bg-[#ececec] text-black ${base}`;
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <Selector
                label="CITY"
                value={config.city}
                onChange={(e) => changeHandler("city", e)}
                options={[
                    { value: "calgary", label: "Calgary" },
                    { value: "edmonton", label: "Edmonton" },
                    { value: "guelph", label: "Guelph" },
                    { value: "hamilton", label: "Hamilton" },
                    { value: "london", label: "London" },
                    { value: "montreal", label: "Montreal" },
                    { value: "ottawa", label: "Ottawa" },
                    { value: "toronto", label: "Toronto" },
                    { value: "vancouver", label: "Vancouver" },
                    { value: "waterloo", label: "Waterloo" },
                ]}
                placeholder="Select City"
            />
            <SelectorChips
                label="START TERM"
                options={[
                    { value: "Fall", label: "Fall" },
                    { value: "Winter", label: "Winter" },
                    { value: "Spring", label: "Spring" },
                ]}
                selected={config.startTerm}
                onChange={(e) => changeHandler("startTerm", e)}
            />
            <SelectorChips
                label="GENDER"
                options={[
                    { value: "Coed", label: "Coed" },
                    { value: "Female Only", label: "Female" },
                    { value: "Male Only", label: "Male" },
                ]}
                selected={config.coed}
                onChange={(e) => changeHandler("coed", e)}
            />
            <SelectorChips
                label="LEASE TYPE"
                options={[
                    { value: "4 Month Sublet", label: "4 month" },
                    { value: "8 Month Sublet", label: "8 month" },
                    { value: "Lease", label: "Lease" },
                ]}
                selected={config.leaseType}
                onChange={(e) => changeHandler("leaseType", e)}
            />
            <PriceSelector
                label="MAX PRICE"
                value={config.price}
                onChange={(e) => changeHandler("price", e)}
            />
            <div className="h-px bg-[#ececec] my-1 w-full" />
            <div className="flex flex-row gap-4 items-end w-full">
                <Selector
                    label="NOTIFY ME EVERY"
                    value={config.pollIntervalHours}
                    onChange={(e) => changeHandler("pollIntervalHours", e)}
                    options={[
                    { value: 6, label: "6 hours" },
                    { value: 12, label: "12 hours" },
                    { value: 24, label: "24 hours" },
                    ]}
                    placeholder="Select Frequency"
                />
                <button
                    onClick={saveConfigHandler}
                    className={saveButtonClasses()}
                    disabled={!isDirty}
                >
                    <Check strokeWidth={2.5}/>
                </button>
            </div>
        </div>
    )
};