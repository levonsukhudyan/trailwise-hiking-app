# Trail and alert data fields

Trail cards still use a small static sample dataset. The prototype now includes a first-pass National Park Service (NPS) API connection for park alerts. A valid NPS API key is required, so live results depend on entering a key and are not verified in the sample dataset.

## Trail record

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `id` | string | Yes | Stable app identifier used by the UI and linked alerts. |
| `name` | string | Yes | Trail name shown in results and details. |
| `area` | string | Yes | Human-readable nearby city or region. |
| `parkName` | string | Yes | Managing park or recreation area, when known. |
| `distanceMiles` | number | Yes | Route distance used for display and distance filtering. |
| `elevationGainFeet` | number | Yes | Elevation gain shown in trail details. |
| `difficulty` | enum: `easy`, `moderate`, `hard` | Yes | Normalized difficulty used for filtering and display. |
| `estimatedMinutes` | integer | No | Approximate hiking time, if a trustworthy source provides it. |
| `routeType` | string | No | For example, `loop` or `out and back`. |
| `summary` | string | No | Short trail description. |
| `sourceName` | string | Yes | Name of the source that supplied the trail information. |
| `sourceUrl` | URL or null | No | Link to the source record or agency page. |
| `lastCheckedAt` | ISO 8601 timestamp or null | Yes | Time this record was last checked by the app; null means unknown/not checked. |
| `dataStatus` | enum: `live`, `stale`, `sample`, `unavailable` | Yes | Helps the UI distinguish verified data from demo, old, or missing data. |
| `alertIds` | array of strings | Yes | IDs of alert records associated with the trail; may be empty. |

Possible later fields include coordinates, route geometry, surface, accessibility details, seasonality, and a source-specific record ID. Add them when the chosen provider supplies them reliably.

## Park alert record

| Field | Type | Required | Purpose |
|---|---|---:|---|
| `id` | string | Yes | Stable app identifier for the alert. |
| `parkId` | string | No | App or provider ID for the affected park. |
| `parkName` | string | Yes | Park or agency area named in the alert. |
| `trailIds` | array of strings | No | Trails explicitly affected by the alert. An empty list means the alert is park-wide or trail mapping is unknown. |
| `title` | string | Yes | Short alert heading. |
| `category` | enum/string | Yes | Type such as `trail_closure`, `road_closure`, `hazard`, or `trail_advisory`. |
| `severity` | enum: `info`, `caution`, `warning`, `emergency` | No | Consistent visual priority; preserve provider severity where available. |
| `status` | enum: `active`, `expired`, `sample`, `unknown` | Yes | Whether the alert is current according to its source, or only illustrative/uncertain. |
| `description` | string | Yes | Agency-provided alert details, or clearly labeled demo text. |
| `issuedAt` | ISO 8601 timestamp or null | No | Time the agency issued the alert. |
| `updatedAt` | ISO 8601 timestamp or null | No | Most recent update time supplied by the agency. |
| `expiresAt` | ISO 8601 timestamp or null | No | Expiration time supplied by the agency. |
| `sourceName` | string | Yes | Agency or dataset responsible for the alert. |
| `sourceUrl` | URL or null | No | Link to the official alert page or API record. |
| `lastCheckedAt` | ISO 8601 timestamp or null | Yes | Time the app last checked the source; keep distinct from the agency's `updatedAt`. |
| `dataStatus` | enum: `live`, `stale`, `sample`, `unavailable` | Yes | Explicit freshness/availability label for the interface. |

## Display and data-handling rules

- A missing alert is not proof that a trail is clear. Show that alert coverage may be incomplete.
- Keep the agency's update time separate from the app's last-check time.
- When timestamps are missing, say they are unavailable; do not invent a time.
- Preserve source names and links with the data so users can check official information.
- Label sample records so they cannot be mistaken for live safety information.
- Normalize units for display while retaining the source value and unit when integrating real APIs.

## NPS alert source connection

The alert panel loads NPS parks in Washington, then requests alerts for the returned park codes. The two-step lookup is needed because the NPS parks endpoint accepts a state code, while the alerts endpoint is filtered by park code.

| Request | Endpoint and parameters | Purpose |
|---|---|---|
| Find Washington parks | `GET https://developer.nps.gov/api/v1/parks?stateCode=WA&limit=50` | Get each park's `parkCode` and `fullName`. |
| Load park alerts | `GET https://developer.nps.gov/api/v1/alerts?parkCode=<comma-separated-codes>&limit=50` | Get the NPS alerts for those parks. |

Both requests send the user's key in the `X-Api-Key` HTTP header. The prototype keeps the key in the current page only; it does not write it to local storage or include it in the URL. A future hosted version should use a server-side proxy so the key is not exposed in browser code.

| NPS value | TrailWise use |
|---|---|
| Park `parkCode` | Build the alert request and match an alert to its park. |
| Park `fullName` | Show the park name when an alert does not include one. |
| Alert `title`, `category`, `description` | Display the alert heading, type, and details. |
| Alert `url` | Link to the official NPS alert page when available. |
| Alert `lastIndexedDate` or another provider update date | Show the agency record date when available; otherwise say it is unavailable. |
| Time the request completes | Show when TrailWise last checked the NPS API; keep separate from the agency date. |

The API returns at most 50 parks and 50 alerts per request in this prototype; pagination is not implemented. NPS alert coverage applies to NPS-managed parks and does not cover all Washington trails. An empty alert response is not proof that a route is open or safe.

## NPS request fallback behavior

| Condition | Interface behavior |
|---|---|
| API key is missing | Ask the user to enter a key without sending a request. |
| Key is rejected | Explain that the key was rejected; show no old or sample alert as current. |
| Rate limit or service error | Show the status and suggest trying again later. |
| Network request fails | Explain that the NPS service could not be reached; do not imply no alerts exist. |
| No alerts are returned | Say NPS returned no alerts for the selected parks and that this does not confirm trail conditions. |
| Optional description, link, or timestamp is missing | Use a clear fallback or omit the link; do not invent information. |

