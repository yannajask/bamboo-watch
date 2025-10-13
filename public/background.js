/* eslint-disable no-undef */
const DOMAIN = 'bamboohousing.ca';
const URL_CONTEXT = 'https://' + DOMAIN;
const COOKIE_NAME = '__bamboo_city';

const DEFAULT_CONFIG = {
    city: "",
    startTerm: [],
    coed: [],
    leaseType: [],
    price: "",
    pages: 3,
    pollIntervalHours: 6
};

const CITY_COOKIE_MAP = {
    "calgary": "{%22Name%22:%22Calgary%22%2C%22Latitude%22:51.0781%2C%22Longitude%22:-114.1353%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/calgary.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d98f%22}",
    "edmonton": "{%22Name%22:%22Edmonton%22%2C%22Latitude%22:53.5232%2C%22Longitude%22:-113.5263%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/edmonton.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d992%22}",
    "guelph": "{%22Name%22:%22Guelph%22%2C%22Latitude%22:43.5329%2C%22Longitude%22:-80.2264%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/guelph.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d98d%22}",
    "hamilton": "{%22Name%22:%22Hamilton%22%2C%22Latitude%22:43.2619%2C%22Longitude%22:-79.9192%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/hamilton.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d991%22}",
    "london": "{%22Name%22:%22London%22%2C%22Latitude%22:43.0096%2C%22Longitude%22:-81.2737%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/london.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d990%22}",
    "montreal": "{%22Name%22:%22Montreal%22%2C%22Latitude%22:45.5044%2C%22Longitude%22:-73.5748%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/montreal.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d993%22}",
    "ottawa": "{%22Name%22:%22Ottawa%22%2C%22Latitude%22:45.4215%2C%22Longitude%22:-75.6972%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/ottawa.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d994%22}",
    "toronto": "{%22Name%22:%22Toronto%22%2C%22Latitude%22:43.6629%2C%22Longitude%22:-79.3957%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/toronto.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d98c%22}",
    "vancouver": "{%22Name%22:%22Vancouver%22%2C%22Latitude%22:49.2606%2C%22Longitude%22:-123.246%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/vancouver.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d98e%22}",
    "waterloo": "{%22Name%22:%22Waterloo%22%2C%22Latitude%22:43.4723%2C%22Longitude%22:-80.5449%2C%22ImgUrl%22:%22https://storage.googleapis.com/bamboo_site_images/city_images/waterloo.png%22%2C%22Active%22:true%2C%22_id%22:%2264b5ed600797988fa2d9d98b%22}",
}

// Get config
async function getConfig() {
    const storageResp = await browser.storage.local.get("config");
    return { ...DEFAULT_CONFIG, ...storageResp.config };
};

// Get saved listings
async function getSavedListings() {
    const storageResp = await browser.storage.local.get("savedListings");
    return storageResp.savedListings || [];
};

// Save listings
async function saveListings(listings) {
    await browser.storage.local.set({ savedListings: listings });
};

// Get last check time
async function getLastCheckTime() {
    const storageResp = await browser.storage.local.get("lastCheckTime");
    return storageResp.lastCheckTime || 0;
}

// Set last check time
async function setLastCheckTime(time) {
    await browser.storage.local.set({ lastCheckTime: time });
}

// Build URL with search parameters
function buildHomepageURL(config, page = 1) {
    const params = new URLSearchParams({
        page: page,
        StartTerm: config.startTerm.join(',') || "",
        RoomsAvailable: "",
        Coed: config.coed.join(',') || "",
        LeaseType: config.leaseType.join(',') || "",
        Price: config.price || "",
        Sort: "Recent",
    });

    return URL_CONTEXT + '/homepage?' + params.toString().replace(/\+/g, '%20');
};

// Fetch listings for a single page
async function fetchPageListings(config, page = 1) {
    try {
        const url = buildHomepageURL(config, page);
        const cityCookie = CITY_COOKIE_MAP[config.city];

        await browser.cookies.remove({
            url: URL_CONTEXT,
            name: COOKIE_NAME
        });

        await browser.cookies.set({
            url: URL_CONTEXT,
            name: COOKIE_NAME,
            value: cityCookie,
            domain: DOMAIN,
            path: '/',
            secure: false
        });

        const html = await fetch(url, { credentials: 'include' }).then(res => res.text());
        const match = html.match(/script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
        if (!match) return [];

        const jsonData = JSON.parse(match[1]);
        const listings = jsonData?.props?.pageProps?.listings || [];
        return listings.map(l => ({
            url: URL_CONTEXT + '/listings?_id=' + l._id,
            title: l.Title,
            address: l.Address,
            price: l.Price,
            postedDate: l.PostedDate,
        }));

    } catch (error) {
        console.log(`Error fetching page ${page}: `, error);
        return [];
    }
};

// Fetch all new listings since last check time
async function fetchNewListings() {
    const config = await getConfig();
    const lastCheckTime = await getLastCheckTime();
    const currentCheckTime = Date.now();
    let listings = [];

    for (let page = 1; page <= config.pages; page++) {
        const pageListings = await fetchPageListings(config, page);
        if (pageListings.length === 0) break;

        let hasOldListings = false;
        const newListings = pageListings.filter(l => {
            const listingPostedTime = new Date(l.postedDate).getTime();
            if (listingPostedTime <= lastCheckTime) {
                hasOldListings = true;
                return false;
            }

            return true;
        });

        listings = listings.concat(newListings);
        if (hasOldListings) break;
    }

    if (listings.length > 0) {
        const prev = await getSavedListings();
        await saveListings(prev.concat(listings));
        await browser.notifications.create({
            type: "basic",
            title: "New listings found on Bamboo!",
            message: `We found ${listings.length} new listings matching your search on Bamboo. Check the "Notifications" tab to access each listing.`,
        });
    }

    await setLastCheckTime(currentCheckTime);
};

// Set up alarm listener
async function startupHandler() {
    const config = await getConfig();
    await setLastCheckTime(Date.now());
    await browser.alarms.clear("check-listings");
    browser.alarms.create("check-listings", {
        periodInMinutes: config.pollIntervalHours * 60,
    });
};

// Alarm handler
async function alarmHandler(alarmInfo) {
    const alarmName = alarmInfo.name;
    if (alarmName !== "check-listings") {
        console.error("Unexpected alarm name: ", alarmName);
    }

    await fetchNewListings();
}

// Attach listeners
browser.runtime.onStartup.addListener(startupHandler);
browser.alarms.onAlarm.addListener(alarmHandler);