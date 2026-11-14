(() => {
  const { trails, alerts } = window.TRAILWISE_DATA;
  const els = {
    search: document.querySelector("#location-search"), difficulty: document.querySelector("#difficulty-filter"),
    distance: document.querySelector("#distance-filter"), sort: document.querySelector("#sort-filter"),
    list: document.querySelector("#trail-list"), count: document.querySelector("#result-count"),
    empty: document.querySelector("#empty-state"), title: document.querySelector("#detail-title"),
    location: document.querySelector("#detail-location"), stats: document.querySelector("#trail-stats"),
    summary: document.querySelector("#detail-summary"), alert: document.querySelector("#alert-box"),
    alertSource: document.querySelector("#alert-source"), source: document.querySelector("#detail-source"),
    updated: document.querySelector("#detail-updated"), save: document.querySelector("#save-trail")
  };
  let selectedId = trails[0]?.id ?? null;
  const savedIds = new Set();
  const nps = {
    key: document.querySelector("#nps-api-key"), button: document.querySelector("#load-nps-alerts"),
    status: document.querySelector("#nps-status"), list: document.querySelector("#nps-alert-list")
  };
  const titleCase = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  function visibleTrails() {
    const query = els.search.value.trim().toLowerCase();
    const maxDistance = els.distance.value === "all" ? Infinity : Number(els.distance.value);
    const filtered = trails.filter((trail) => {
      const matchesText = !query || `${trail.name} ${trail.area} ${trail.parkName}`.toLowerCase().includes(query);
      const matchesDifficulty = els.difficulty.value === "all" || trail.difficulty === els.difficulty.value;
      return matchesText && matchesDifficulty && trail.distanceMiles <= maxDistance;
    });
    if (els.sort.value === "distance") filtered.sort((a, b) => a.distanceMiles - b.distanceMiles);
    if (els.sort.value === "difficulty") {
      const order = { easy: 0, moderate: 1, hard: 2 };
      filtered.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
    }
    return filtered;
  }

  function createCard(trail) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `trail-card${trail.id === selectedId ? " selected" : ""}`;
    card.setAttribute("aria-pressed", String(trail.id === selectedId));
    card.setAttribute("aria-label", `${trail.name}, ${titleCase(trail.difficulty)}, ${trail.distanceMiles} miles`);
    card.innerHTML = `
      <span class="trail-thumb" aria-hidden="true"><span class="thumb-sun"></span><span class="thumb-ridge"></span></span>
      <span class="card-content">
        <span class="card-topline"><span class="trail-name">${trail.name}</span><span class="demo-tag">SAMPLE</span></span>
        <span class="trail-area">${trail.area}</span>
        <span class="card-metrics"><span class="difficulty-badge ${trail.difficulty}">${titleCase(trail.difficulty)}</span><span class="metric-inline"><span class="metric-icon" aria-hidden="true">↔</span>${trail.distanceMiles.toFixed(1)} mi</span></span>
        <span class="card-match"><span class="match-dot"></span>${trail.routeType} · ${Math.round(trail.estimatedMinutes / 60 * 10) / 10} hr estimate</span>
      </span><span class="card-chevron" aria-hidden="true">›</span>`;
    card.addEventListener("click", () => { selectedId = trail.id; render(); });
    return card;
  }

  function renderList() {
    const matches = visibleTrails();
    els.list.replaceChildren(...matches.map(createCard));
    els.count.textContent = String(matches.length);
    els.empty.hidden = matches.length !== 0;
    if (!matches.some((trail) => trail.id === selectedId)) selectedId = matches[0]?.id ?? null;
    renderDetail(matches.find((trail) => trail.id === selectedId) ?? null);
    if (matches.length) els.list.replaceChildren(...matches.map(createCard));
  }

  function renderDetail(trail) {
    const hasTrail = Boolean(trail);
    els.title.textContent = hasTrail ? trail.name : "No trail selected";
    els.location.textContent = hasTrail ? `${trail.parkName} · ${trail.area}` : "Adjust your filters to see matching trails.";
    els.summary.textContent = hasTrail ? trail.summary : "Try broadening your search to see trail details.";
    els.stats.innerHTML = hasTrail ? `
      <div class="stat"><span class="stat-label">DIFFICULTY</span><span class="stat-value">${titleCase(trail.difficulty)}</span></div>
      <div class="stat"><span class="stat-label">DISTANCE</span><span class="stat-value">${trail.distanceMiles.toFixed(1)} mi</span></div>
      <div class="stat"><span class="stat-label">ELEVATION GAIN</span><span class="stat-value">${trail.elevationGainFeet.toLocaleString()} ft</span></div>` : "";
    const alert = hasTrail ? alerts.find((item) => trail.alertIds.includes(item.id)) : null;
    els.alert.classList.toggle("clear", !alert);
    els.alert.querySelector("b").textContent = alert ? "Sample alert · not live" : "No alert in the demo data";
    els.alert.querySelector("p").textContent = alert ? alert.description : "This only means the sample dataset has no alert for this trail. It does not confirm current conditions.";
    els.alertSource.textContent = alert ? `Source: ${alert.sourceName} · no live check` : "Demo dataset only · no live alert check";
    els.source.textContent = hasTrail ? `Trail source: ${trail.sourceName}` : "Trail data: sample dataset";
    els.updated.textContent = hasTrail && trail.lastCheckedAt ? `Checked ${new Date(trail.lastCheckedAt).toLocaleDateString()}` : "Not live";
    els.save.disabled = !hasTrail;
    els.save.setAttribute("aria-pressed", String(hasTrail && savedIds.has(trail.id)));
    els.save.querySelector("span:last-child").textContent = hasTrail && savedIds.has(trail.id) ? "Saved" : "Save";
    els.save.querySelector("span:first-child").textContent = hasTrail && savedIds.has(trail.id) ? "♥" : "♡";
  }

  function render() {
    const matches = visibleTrails();
    els.list.replaceChildren(...matches.map(createCard));
    els.count.textContent = String(matches.length);
    els.empty.hidden = matches.length > 0;
    if (!matches.some((trail) => trail.id === selectedId)) selectedId = matches[0]?.id ?? null;
    renderDetail(matches.find((trail) => trail.id === selectedId) ?? null);
    // Rebuild once more after selection correction so the selected card state matches the detail panel.
    els.list.replaceChildren(...matches.map(createCard));
  }

  [els.search, els.difficulty, els.distance, els.sort].forEach((control) => control.addEventListener(control === els.search ? "input" : "change", render));
  document.querySelector("#clear-search").addEventListener("click", () => { els.search.value = ""; render(); els.search.focus(); });
  const reset = () => { els.search.value = ""; els.difficulty.value = "all"; els.distance.value = "all"; els.sort.value = "recommended"; render(); };
  document.querySelector("#reset-filters").addEventListener("click", reset);
  document.querySelector("#empty-reset").addEventListener("click", reset);
  els.save.addEventListener("click", () => {
    if (!selectedId) return;
    if (savedIds.has(selectedId)) savedIds.delete(selectedId); else savedIds.add(selectedId);
    render();
  });

  function showNpsStatus(message, state = "") {
    nps.status.textContent = message;
    nps.status.className = `nps-status${state ? ` ${state}` : ""}`;
  }

  function renderNpsAlerts(items, checkedAt) {
    nps.list.replaceChildren();
    if (!items.length) {
      showNpsStatus(`The NPS API returned no alerts for Washington at ${checkedAt}. This does not confirm that a trail is clear.`, "empty");
      return;
    }
    showNpsStatus(`${items.length} official alert${items.length === 1 ? "" : "s"} loaded from the NPS API · checked ${checkedAt}.`, "success");
    const fragment = document.createDocumentFragment();
    for (const item of items) {
      const card = document.createElement("article");
      card.className = "nps-alert-card";
      const title = document.createElement("h3");
      title.textContent = item.title || "Park alert";
      const park = document.createElement("p");
      park.className = "nps-alert-park";
      park.textContent = [item.parkName, item.category].filter(Boolean).join(" · ") || "National Park Service";
      const description = document.createElement("p");
      description.textContent = item.description || "The NPS record did not include a description.";
      const metadata = document.createElement("p");
      metadata.className = "nps-alert-meta";
      const updated = item.lastIndexedDate || item.lastUpdatedDate || item.createdAt;
      metadata.textContent = `Source: National Park Service · ${updated ? `agency record ${updated}` : "agency update time unavailable"} · checked ${checkedAt}`;
      card.append(title, park, description, metadata);
      if (item.url) {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "View official alert ↗";
        card.append(link);
      }
      fragment.append(card);
    }
    nps.list.append(fragment);
  }

  async function loadNpsAlerts() {
    const apiKey = nps.key.value.trim();
    nps.list.replaceChildren();
    if (!apiKey) {
      showNpsStatus("Enter your NPS API key first. The key is required by the NPS API.", "error");
      nps.key.focus();
      return;
    }
    nps.button.disabled = true;
    showNpsStatus("Loading Washington alerts from the National Park Service…", "loading");
    try {
      const headers = { "X-Api-Key": apiKey, Accept: "application/json" };
      const parksUrl = new URL("https://developer.nps.gov/api/v1/parks");
      parksUrl.searchParams.set("stateCode", "WA");
      parksUrl.searchParams.set("limit", "50");
      const parksResponse = await fetch(parksUrl, { headers });
      if (!parksResponse.ok) {
        if (parksResponse.status === 401 || parksResponse.status === 403) throw new Error("The key was rejected. Check that it is valid and try again.");
        if (parksResponse.status === 429) throw new Error("The NPS API rate limit was reached. Wait a while, then try again.");
        throw new Error(`The NPS service returned an error (${parksResponse.status}). Try again later.`);
      }
      const parksPayload = await parksResponse.json();
      if (!Array.isArray(parksPayload.data)) throw new Error("The NPS response did not contain a park list.");
      const parkNames = new Map(parksPayload.data.filter((park) => park.parkCode).map((park) => [park.parkCode, park.fullName]));
      const parkCodes = [...parkNames.keys()];
      if (!parkCodes.length) throw new Error("The NPS API returned no park codes for Washington.");

      const alertsUrl = new URL("https://developer.nps.gov/api/v1/alerts");
      alertsUrl.searchParams.set("parkCode", parkCodes.join(","));
      alertsUrl.searchParams.set("limit", "50");
      const response = await fetch(alertsUrl, { headers });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) throw new Error("The key was rejected. Check that it is valid and try again.");
        if (response.status === 429) throw new Error("The NPS API rate limit was reached. Wait a while, then try again.");
        throw new Error(`The NPS service returned an error (${response.status}). Try again later.`);
      }
      const payload = await response.json();
      if (!Array.isArray(payload.data)) throw new Error("The NPS response did not contain an alert list.");
      const checkedAt = new Date().toLocaleString();
      renderNpsAlerts(payload.data.map((alert) => ({
        ...alert,
        parkName: alert.parkName || parkNames.get(alert.parkCode) || "Washington National Park"
      })), checkedAt);
    } catch (error) {
      const message = error instanceof TypeError
        ? "Could not reach the NPS API. Check your connection or browser access, then try again."
        : error.message || "The alert request failed. Try again later.";
      showNpsStatus(`${message} TrailWise has no current alert data to show.`, "error");
    } finally {
      nps.button.disabled = false;
    }
  }

  nps.button.addEventListener("click", loadNpsAlerts);
  render();
})();

