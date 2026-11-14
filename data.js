/* Demo content only. These entries are illustrative and are not connected to live trail or park-alert services. */
window.TRAILWISE_DATA = {
  trails: [
    {
      id: "rattlesnake-ledge-demo",
      name: "Rattlesnake Ledge",
      area: "North Bend, Washington",
      parkName: "Rattlesnake Mountain Scenic Area",
      distanceMiles: 4.0,
      elevationGainFeet: 1160,
      difficulty: "moderate",
      estimatedMinutes: 160,
      routeType: "Out and back",
      summary: "A forested climb to a broad viewpoint above Rattlesnake Lake. This demo description is for the interface prototype and should be checked against an official source before use.",
      sourceName: "TrailWise demonstration data",
      sourceUrl: null,
      lastCheckedAt: null,
      dataStatus: "sample",
      alertIds: ["alert-rattlesnake-demo"]
    },
    {
      id: "twin-falls-demo",
      name: "Twin Falls",
      area: "North Bend, Washington",
      parkName: "Olallie State Park",
      distanceMiles: 2.6,
      elevationGainFeet: 500,
      difficulty: "moderate",
      estimatedMinutes: 95,
      routeType: "Out and back",
      summary: "A short forest walk toward waterfall viewpoints. The distance, elevation, and description are demo values only; verify route details with the managing agency.",
      sourceName: "TrailWise demonstration data",
      sourceUrl: null,
      lastCheckedAt: null,
      dataStatus: "sample",
      alertIds: []
    },
    {
      id: "little-si-demo",
      name: "Little Si",
      area: "North Bend, Washington",
      parkName: "Mount Si Natural Resources Conservation Area",
      distanceMiles: 4.7,
      elevationGainFeet: 1300,
      difficulty: "hard",
      estimatedMinutes: 210,
      routeType: "Out and back",
      summary: "A steeper forest route with rocky sections and a summit-area viewpoint. All details in this entry are illustrative and not verified for current conditions.",
      sourceName: "TrailWise demonstration data",
      sourceUrl: null,
      lastCheckedAt: null,
      dataStatus: "sample",
      alertIds: []
    }
  ],
  alerts: [
    {
      id: "alert-rattlesnake-demo",
      parkId: "rattlesnake-scenic-area-demo",
      parkName: "Rattlesnake Mountain Scenic Area",
      trailIds: ["rattlesnake-ledge-demo"],
      title: "Sample trail advisory",
      category: "trail_advisory",
      severity: "caution",
      status: "sample",
      description: "Illustrative alert text for the prototype. This is not a real advisory and does not describe current trail conditions.",
      issuedAt: null,
      updatedAt: null,
      expiresAt: null,
      sourceName: "Example alert data",
      sourceUrl: null,
      lastCheckedAt: null,
      dataStatus: "sample"
    }
  ]
};

