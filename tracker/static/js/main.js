document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Multi-File Selection Text UI Counter ---
    const fileInput = document.getElementById('imageInput');
    const uploadText = document.getElementById('uploadText');

    if (fileInput && uploadText) {
        fileInput.addEventListener('change', (e) => {
            const count = e.target.files.length;
            if (count > 0) {
                uploadText.textContent = `LOADED: ${count} PAYLOAD FILES`;
                uploadText.style.color = '#38bdf8';
            }
        });
    }

    // --- 2. Advanced Map Engine Core Integration ---
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // Safe-unpack the chronological image array extracted from Django context
        const imagesData = JSON.parse(document.getElementById('images-json')?.textContent || '[]');

        // Global default view positions if no data points exist yet
        let initialLat = 14.4290;
        let initialLon = 120.9360;
        let initialZoom = 4;

        // Initialize tactical map engine layer configurations
        const map = L.map('map', { zoomControl: false }).setView([initialLat, initialLon], initialZoom);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Transliterated OpenStreetMap Layer (Converts foreign writing systems to Latin script)
        L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markerMapList = [];
        const trackingLineCoordinates = [];

        // Loop array data to map active markers
        imagesData.forEach((node) => {
            if (node.status === "Found" && node.coordinates) {
                const lat = parseFloat(node.coordinates.lat);
                const lon = parseFloat(node.coordinates.lon);

                if (!isNaN(lat) && !isNaN(lon)) {
                    // Cache the coordinates for tracking polyline strings
                    trackingLineCoordinates.push([lat, lon]);

                    // Plot pin layer to map
                    const marker = L.marker([lat, lon]).addTo(map);
                    marker.bindPopup(`
                        <div style="color: #0c0f17; font-family: sans-serif; font-size: 11px; line-height: 1.45;">
                            <strong style="color: #0ea5e9; font-weight: 700;">[!] NODE TRACKED: ${node.name}</strong><br>
                            <span style="color: #64748b;">TIME:</span> ${node.timestamp}<br>
                            <span style="color: #64748b;">LAT:</span> ${lat.toFixed(6)}<br>
                            <span style="color: #64748b;">LON:</span> ${lon.toFixed(6)}
                        </div>
                    `);

                    markerMapList.push(marker);
                }
            }
        });

        // --- Intelligence Tooling: Draw Chronological Path Tracklines ---
        // Connect points with a high-visibility cyber dash track. Because your backend view 
        // pre-sorts items chronologically, this array creates an exact historical timeline.
        if (trackingLineCoordinates.length > 1) {
            L.polyline(trackingLineCoordinates, {
                color: '#38bdf8',       // Custom cyber neon blue tracks
                weight: 2,
                dashArray: '5, 8',     // Investigative timeline dash layout styles
                opacity: 0.85,
                smoothFactor: 1.0
            }).addTo(map);
        }

        // Auto-frame map viewpoints if any valid coordinate entries populate the viewport
        if (markerMapList.length > 0) {
            const markerGroup = new L.featureGroup(markerMapList);
            map.fitBounds(markerGroup.getBounds().pad(0.20));
        }

        // --- 3. Panel Interactivity Navigation Map Controls ---
        // Intercept clicks on list items, pull matching datasets, pan views smoothly, and trigger popups.
        document.querySelectorAll('.telemetry-item.has-coordinates').forEach((card) => {
            card.addEventListener('click', () => {
                const targetLat = parseFloat(card.dataset.lat);
                const targetLon = parseFloat(card.dataset.lon);

                if (!isNaN(targetLat) && !isNaN(targetLon)) {
                    // Smooth pan transition lock directly over selected node target
                    map.setView([targetLat, targetLon], 16, {
                        animate: true,
                        duration: 0.75
                    });

                    // Search map indices to programmatically trigger corresponding labels
                    markerMapList.forEach((marker) => {
                        const markerCoords = marker.getLatLng();
                        if (markerCoords.lat === targetLat && markerCoords.lng === targetLon) {
                            marker.openPopup();
                        }
                    });
                }
            });
        });
    }
});