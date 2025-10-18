import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

async function getSavedListings() {
    const storageResp = await browser.storage.local.get("savedListings");
    return storageResp.savedListings || [];
};

async function dismissListing(url) {
    const storageResp = await browser.storage.local.get("savedListings");
    const currentListings = storageResp.savedListings || [];
    const updatedListings = currentListings.filter(l => l.url !== url);
    await browser.storage.local.set({ savedListings: updatedListings });
};

function Notification({ listing, onDismiss }) {
    return (
        <div className="p-2 border-b border-[#ececec] flex flex-col gap-1 hover:bg-[#fafafa] cursor-pointer">
            <a
                href={listing.url}
                rel="noopener noreferrer" 
                target="_blank"
                className="cursor-pointer"
            >
                {listing.title}
            </a>
            <p className="text-xs truncate">{listing.address}</p>
            <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">${listing.price} per month</span>
                <button
                    onClick={() => onDismiss(listing.url)}
                    className="cursor-pointer"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    )
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    const loadListings = useCallback(async () => {
        getSavedListings().then((listings) => {
            setNotifications(listings);
        });
    }, []);

    const handleDismiss = useCallback((url) => {
        dismissListing(url);
    }, []);

    const handleStorageChange = (changes, area) => {
        if (area === "local" && changes.savedListings) {
            setNotifications(changes.savedListings.newValue || []);
        }
    };

    // load initial state and listeners for notifications
    useEffect(() => {
        loadListings();
        browser.storage.onChanged.addListener(handleStorageChange);
        return () => {
            browser.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [loadListings]);

    return (
        <div className="flex flex-col gap-0 overflow-y-auto max-h-[449.6px] px-4">
            {notifications.length === 0 ? (
                <p className="pt-2 text-center text-[#989494] text-base">No new listings.</p>
            ) : (
                notifications.map((l) => (
                    <Notification
                        listing={l}
                        onDismiss={handleDismiss}
                        key={l.url}
                    />
                ))
            )}
        </div>
    )
}