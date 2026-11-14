# TrailWise

TrailWise is a responsive web prototype for discovering hikes and reviewing trail details. It is an in-progress CSS 497 capstone project.

## What it includes

- Search and filter sample trails by name, difficulty, and distance
- Compare trail details such as distance and elevation gain
- Save a trail during the current browser session
- Optionally load official National Park Service (NPS) park alerts with an API key
- Show loading, empty, and error states for alert requests
- Document the trail and alert data fields in `data-model.md`

## Current data limits

Trail listings and trail details use sample records in `data.js`; they are not live trail conditions or a complete trail inventory. Park alerts can be requested from the NPS API, but require a valid NPS API key. Alert coverage varies by park, and no alert result does not guarantee that a trail is open or safe. Check the official park source before a hike.

The current prototype sends the NPS API key from the browser. That is acceptable only for a local demonstration with a key you control. A deployed version should keep credentials on a server and request alerts through a server-side endpoint.

## Run locally

Open this folder in a code editor and serve it with a local static web server (for example, the Live Server extension in Visual Studio Code). Then open the local address it provides. The app uses plain HTML, CSS, and JavaScript; no package installation is required.

To try live alerts, enter your NPS API key in the park alerts section. Do not commit API keys or other credentials to this repository.

## Project files

- `index.html` — app page and interface structure
- `styles.css` — responsive visual styles
- `app.js` — search, filters, trail details, saved trails, and NPS alert requests
- `data.js` — sample trail and alert records
- `data-model.md` — trail/alert fields and data-handling notes

## Status

This is a prototype for coursework and demonstration. Live trail inventory, reliable trail-to-alert matching, backend credential handling, and broader device/accessibility testing remain future work.

