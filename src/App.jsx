import { useEffect, useState } from "react";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

const DEFAULT_CONFIG = {
    city: "",
    startTerm: [],
    coed: [],
    leaseType: [],
    price: "",
    pages: 3,
    pollIntervalHours: 6,
};

async function getConfig() {
    const storageResp = await browser.storage.local.get("config");
    return storageResp.config || [];
};

async function saveConfig(config) {
    await browser.storage.local.set({ config: config });
};

export default function App() {
    const [initialConfig, setInitialConfig] = useState(DEFAULT_CONFIG);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [isSaved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("Notifications");

    // set initial state, fallback to default config if needed
    useEffect(() => {
        getConfig().then((config) => {
            setConfig({ ...config });
            setInitialConfig({ ...config });
        })
        .catch(() => {
            setConfig({ ...DEFAULT_CONFIG });
            setInitialConfig({ ...DEFAULT_CONFIG });
        });
    }, []);

    // flag if unsaved changes have been made
    const isDirty = (JSON.stringify(config) !== JSON.stringify(initialConfig));
    
	const handleConfigSave = async() => {
		if (!isDirty) return;
		await saveConfig(config);
		setSaved(true);
		setInitialConfig({ ...config });
		setTimeout(() => setSaved(false), 1000);
	};

    const handleConfigChange = (key, value) => {
        let newValue = value;
        if (key === "pollIntervalHours") newValue = Number(value);
		setConfig((prev) => ({...prev, [key]: newValue }));
    };

	const tabButtonClasses = (tab) => {
		const base = "rounded-full h-8 gap-1.5 px-4.5 ease-in duration-75 transition-colors";
		if (activeTab === tab) {
			return `bg-black text-white hover:opacity:90 ${base}`;
		} else {
			return `bg-[#ececec] text-black hover:shadow-sm cursor-pointer ${base}`;
		}
	};

    return (
      	<div className="p-4 bg-white w-[284px] max-h-[522.6px] overflow-hidden">
        	<div className="flex flex-col justify-center">
          		<div className="flex flex-row items-center justify-center gap-4 pb-4">
					<button
						onClick={() => setActiveTab("Notifications")}
						className={tabButtonClasses("Notifications")}
					>
						Notifications
					</button>
					<button
						onClick={() => setActiveTab("Settings")}
						className={tabButtonClasses("Settings")}
					>
						Settings
					</button>
          		</div>
          		<div className="h-px bg-[#ececec] my-1 w-full" />
          		<div className="flex flex-col">
            		{activeTab === "Settings"
                		? (
						<SettingsPage 
							config={config}
							isDirty={isDirty}
							isSaved={isSaved}
							changeHandler={handleConfigChange}
							saveConfigHandler={handleConfigSave}
                		/>
              			)
              			: <NotificationsPage />
            		}
          		</div>
       		</div>
      	</div>
    )
};