import React from 'react'
import { Check } from 'lucide-react'
import Selector from './components/selector'
import PriceSelector from './components/price'
import SelectorChips from './components/chips'

const DEFAULT_CONFIG = {
    city: "",
    startTerm: [],
    coed: [],
    leaseType: [],
    price: "",
    pages: 3,
    pollIntervalHours: 6,
};


function App() {
  const [initialConfig, setInitialConfig] = React.useState(DEFAULT_CONFIG);
  const [config, setConfig] = React.useState(DEFAULT_CONFIG);
  const [saved, setSaved] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("Notifications");

  React.useEffect(() => {
    async function loadConfig() {
      try {
        const storageResp = await browser.storage.local.get("config");
        const loadedConfig = storageResp.config || DEFAULT_CONFIG;
        setConfig({ ...loadedConfig });
        setInitialConfig({ ...loadedConfig });
      } catch (error) {
        console.error("Failed to load config: ", error);
      }
    }
    loadConfig();
  }, []);

  const saveConfig = async () => {
    if (!dirty) return;
    try {
      await browser.storage.local.set({ config: config });
      setSaved(true);
      setInitialConfig({ ...config });
      setTimeout(() => setSaved(false), 1000);
    } catch (error) {
      console.error("Failed to save config: ", error);
    }
  };

  const handleChange = (key, value) => {
    let newValue = value;
    if (key === "pollIntervalHours") newValue = Number(value);
    setConfig((prev) => ({...prev, [key]: newValue }));
  };

  const dirty = (JSON.stringify(config) !== JSON.stringify(initialConfig));

  const saveButtonClasses = () => {
    const base = "rounded-xl h-9 px-1.75 ease-in duration-75 transition-colors";
    if (saved) {
      return `bg-green-200 text-white ${base}`;
    } else if (dirty) {
      return `bg-black text-white hover:opacity-90 ${base} hover:shadow-md`;
    } else {
      return `bg-[#ececec] text-black ${base}`;
    }
  };

  const Settings = (
  <>
      <Selector
        label="CITY"
        value={config.city}
        onChange={(e) => handleChange("city", e)}
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
        onChange={(selected) => handleChange("startTerm", selected)}
      />
      <SelectorChips
        label="GENDER"
        options={[
          { value: "Coed", label: "Coed" },
          { value: "Female Only", label: "Female" },
          { value: "Male Only", label: "Male" },
        ]}
        selected={config.coed}
        onChange={(selected) => handleChange("coed", selected)}
      />
      <SelectorChips
        label="LEASE TYPE"
        options={[
          { value: "4 Month Sublet", label: "4 month" },
          { value: "8 Month Sublet", label: "8 month" },
          { value: "Lease", label: "Lease" },
        ]}
        selected={config.leaseType}
        onChange={(selected) => handleChange("leaseType", selected)}
      />
      <PriceSelector
        label="MAX PRICE"
        value={config.price}
        onChange={(e) => handleChange("price", e)}
      />
      <div className="h-px bg-[#ececec] my-1 w-full" />
      <div className="flex flex-row gap-4 items-end w-full">
      <Selector
        label="NOTIFY ME EVERY"
        value={config.pollIntervalHours}
        onChange={(e) => handleChange("pollIntervalHours", e)}
        options={[
          { value: 6, label: "6 hours" },
          { value: 12, label: "12 hours" },
          { value: 24, label: "24 hours" },
        ]}
        placeholder="Select Frequency"
      />
      <button
          onClick={saveConfig}
          className={saveButtonClasses()}
          disabled={!dirty}
      >
        <Check strokeWidth={2.5}/>
      </button>
    </div>
  </>
  )

  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-lg w-[284px] max-h-[522.6px] overflow-hidden">
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setActiveTab('Notifications')}
              className="bg-[#ececec] rounded-full h-8 gap-1.5 px-4.5 hover:shadow-sm ease-in duration-75"
            >
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('Settings')}
              className="bg-[#ececec] rounded-full h-8 gap-1.5 px-4.5 hover:shadow-sm ease-in duration-75"
            >
              Settings
            </button>
          </div>
          <div className="h-px bg-[#ececec] my-1 w-full"/>
          <div className="flex flex-col gap-4">
            {activeTab === 'Settings' ? Settings : <div/>}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
