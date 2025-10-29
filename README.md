# Bamboo Watch

A minimal browser extension to get notified for new listings matching your search on [Bamboo](https://bamboohousing.ca/).

## Installing

This extension is currently under the process of being validated by Mozilla to be able to download from their extensions store.

To install locally, you can clone this repo and run the commands
```
npm install
npm run build
```
which will generate a `/dist` directory.

You can then head to
```
about:debugging
```
in Firefox and upload the `dist/manifest.json` file. This will only run the extension temporarily.

## Troubleshooting

Bamboo uses session cookies for the city parameter. If you experience issues with fetching listings, then delete any stored cookies on the Bamboo website.