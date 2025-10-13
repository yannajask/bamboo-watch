/* eslint-disable no-undef */
const HOMEPAGE_BASE_URL = 'https://www.bamboohousing.ca/homepage?';
const LISTING_BASE_URL = 'https://www.bamboohousing.ca/listings?_id=';

const DEFAULT_CONFIG = {
    startTerm: "",
    coed: "",
    leaseType: "",
    price: "",
    pages: 3,
    pollIntervalHours: 6
};

// get config
async function getConfig() {
    const storageResp = await browser.storage.local.get("config");
    return storageResp.config || DEFAULT_CONFIG;
};

// save seen listings
async function saveListings(listings) {
    await browser.storage.local.set({ seenListings: listings });
};

// load seen listings
async function loadSavedListings() {
    const result = await browser.storage.local.get("seenListings");
    return result.seenListings || [];
};

function buildHomepageURL(config, page = 1) {
    const params = new URLSearchParams({
        Sort: "Recent",
        StartTerm: config.startTerm || "",
        RoomsAvailable: "",
        Coed: config.coed || "",
        LeaseType: config.leaseType || "",
        Price: config.price || "",
        pagination: "true",
        page
    });

    return HOMEPAGE_BASE_URL + params.toString();
};

// Fetch listings for a single page
async function fetchPageListings(config, page = 1) {
    try {
        const url = buildHomepageURL(config, page);
        const html = await fetch(url).then(res => res.text());
        const match = html.match(/script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
        if (!match) return [];

        const jsonData = JSON.parse(match[1]);
        const listings = jsonData?.props?.pageProps?.listings || [];
        return listings.map(l => ({
            url: LISTING_BASE_URL + l._id,
            title: l.Title,
            address: l.Address,
            price: l.Price,
        }));

    } catch (error) {
        console.log(`Error fetching page ${page}: `, error);
        return [];
    }
};

// scrape all new listings
async function checkListings() {
    const config = await getConfig();
    let listings = [];

    for (let page = 1; i <= config.pages; page++) {
        const pageListings = await fetchPageListings(config, page);
        if (listings.length === 0) break;
        listings = listings.concat(pageListings);
    }

    const prev = await loadSavedListings();
    const newListings = listings.filter(l => !prev.some(p => p.url === l.url));

    if (newListings.length > 0) {
        await saveListings(listings);
        await browser.notifications.create({
            type: "basic",
            title: "New listings found on Bamboo!",
            message: `We found ${newListings.length} new listings matching your search on Bamboo. Check the "Notifications" tab to access each listing.`,
        });
    }
};

// setup alarm listener
async function startupHandler() {
    const config = await getConfig();
    await browser.alarms.clear("check-listings");
    browser.alarms.create("check-listings", {
        periodInMinutes: config.pollIntervalHours * 60,
    });
};

async function alarmHandler(alarmInfo) {
    const alarmName = alarmInfo.name;
    if (alarmName !== "check-listings") {
        console.error("Unexpected alarm name: ", alarmName);
    }

    await checkListings();
}

// Attach listeners
browser.runtime.onStartup.addListener(startupHandler);
browser.runtime.onAlarm.addListener(alarmHandler);