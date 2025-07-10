document.addEventListener('DOMContentLoaded', async () => {
    // Get API URL and ensure blockonsMapObj is available
    const apiUrl = blockonsMapObj.apiUrl;
    let mapboxToken = null;

    try {
        const response = await fetch(
            `${apiUrl}blcns/v1/get-api-key?key_type=maps`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': blockonsMapObj.nonce,
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch Mapbox API key');
        }

        const data = await response.json();
        
        if (!data.success || !data.api_key) {
            throw new Error('No valid API key returned');
        }

        mapboxToken = data.api_key;
        mapboxgl.accessToken = mapboxToken;

    } catch (err) {
        console.error('Error fetching Mapbox API key:', err);

        // Display error message in all map containers
        document.querySelectorAll('.blockons-mapbox').forEach((mapElement) => {
            mapElement.classList.remove('loading');
            const settingsUrl = blockonsMapObj.settingsUrl || '';
            mapElement.innerHTML = `
                <div class="blockons-mapbox-error">
                    <p>A valid Mapbox API key is required to display the map.</p>
                </div>
            `;
        });
        return;
    }

    // If no token was returned, display a message
    if (!mapboxToken) {
        document.querySelectorAll('.blockons-mapbox').forEach((mapElement) => {
            mapElement.classList.remove('loading');
            const settingsUrl = blockonsMapObj.settingsUrl || '';
            mapElement.innerHTML = `
                <div class="blockons-mapbox-error">
                    <p>A valid Mapbox API key is required to display the map.</p>
                </div>
            `;
        });
        return;
    }

    // Initialize maps if token is valid
    const maps = document.querySelectorAll('.blockons-mapbox');
    if (!maps.length) return;
    maps.forEach(initMap);
});

function initMap(mapElement) {
	const mapContainer = mapElement.querySelector('.blockons-map-container');
	if (!mapContainer) {
		console.error('Map container not found inside', mapElement);
		return;
	}
	mapElement.classList.remove('loading');
	// Clear the container before initializing the map
	mapContainer.innerHTML = '';

	// Parse settings from data attributes
	const latitude = parseFloat(mapElement.dataset.latitude) || -33.9249;
	const longitude = parseFloat(mapElement.dataset.longitude) || 18.4241;
	const zoom = parseFloat(mapElement.dataset.zoom) || 14;
	const markersData = mapElement.dataset.markers
		? JSON.parse(mapElement.dataset.markers)
		: [];
	const markersColor = mapElement.dataset.markercolor || '#b30a57';
	const markersBgColor = mapElement.dataset.markerbgcolor || '#FFF';
	let selectedMarkerIndex = mapElement.dataset.selectedmarker
		? parseInt(mapElement.dataset.selectedmarker, 10)
		: null;

	const map = new mapboxgl.Map({
		container: mapContainer,
		style: 'mapbox://styles/mapbox/streets-v11',
		center: [longitude, latitude],
		zoom: zoom,
	});

	const markerInfoBlock = mapElement.querySelector(
		'.blockons-marker-infoblock',
	);
	// Marker icons outside the map (if any)
	const markerIcons = Array.from(
		mapElement.querySelectorAll('.blockons-map-icon'),
	);
	// Array to store actual map marker DOM elements
	const mapMarkerEls = [];

	// Function to update both external marker icons and map markers
	const updateIcons = () => {
		markerIcons.forEach((icon, index) => {
			const marker = markersData[index];
			if (marker) {
				const isSelected = index === selectedMarkerIndex;
				icon.style.backgroundColor = isSelected
					? marker.iconColor || markersColor
					: '#fff';
				icon.style.color = isSelected
					? '#fff'
					: marker.iconColor || markersColor;
				icon.classList.toggle('selected', isSelected);
			}
		});
		// Update the actual map marker elements
		mapMarkerEls.forEach((el, index) => {
			el.classList.toggle('selected', index === selectedMarkerIndex);
		});
	};

	// Function to update the marker info block content
	const updateMarkerInfo = () => {
		if (markerInfoBlock && markersData[selectedMarkerIndex]) {
			markerInfoBlock.innerHTML = `
		  <div class="blockons-marker-close-infoblock fas fa-xmark"></div>
		  <h6>${markersData[selectedMarkerIndex].title || ''}</h6>
		  <p>${markersData[selectedMarkerIndex].description || ''}</p>
		`;
			markerInfoBlock.style.display = 'block';
			markerInfoBlock
				.querySelector('.blockons-marker-close-infoblock')
				.addEventListener('click', deselectMarker);
		} else if (markerInfoBlock) {
			markerInfoBlock.style.display = 'none';
			markerInfoBlock.innerHTML = '';
		}
	};

	// Function to explicitly select a marker
	const selectMarker = (index, addZoom = false) => {
		selectedMarkerIndex = index;
		const marker = markersData[selectedMarkerIndex];
		if (marker) {
			map.flyTo({
				center: [
					parseFloat(marker.longitude),
					parseFloat(marker.latitude),
				],
				...(addZoom ? { zoom: 14 } : {}),
				essential: true,
			});
		}
		updateIcons();
		updateMarkerInfo();
	};

	const updateSelectedMarker = (index, addZoom) => {
		// If clicking on the already selected marker, deselect it.
		if (selectedMarkerIndex === index) {
			return deselectMarker();
		}
		selectMarker(index, addZoom);
	};

	const deselectMarker = () => {
		selectedMarkerIndex = null;
		updateIcons();
		updateMarkerInfo();
	};

	// Function to fit the map bounds to include all markers
	const fitBoundsToMarkers = () => {
		if (!markersData.length) return;
		const bounds = new mapboxgl.LngLatBounds();
		markersData.forEach((marker) => {
			bounds.extend([
				parseFloat(marker.longitude),
				parseFloat(marker.latitude),
			]);
		});
		map.fitBounds(bounds, {
			padding: 100,
			maxZoom: 15,
			essential: true,
		});
	};

	// Add markers to the map and store their elements
	if (Array.isArray(markersData)) {
		markersData.forEach((marker, index) => {
			const el = document.createElement('div');
			el.className = `blockons-map-marker ${marker.icon || 'fas fa-map-marker-alt'}`;
			el.style.color = marker.iconColor || markersColor;
			el.style.backgroundColor = marker.iconBgColor || markersBgColor;
			if (selectedMarkerIndex !== null && selectedMarkerIndex === index) {
				el.classList.add('selected');
			}
			// Store the marker element for later updates
			mapMarkerEls.push(el);
			new mapboxgl.Marker(el)
				.setLngLat([
					parseFloat(marker.longitude),
					parseFloat(marker.latitude),
				])
				.addTo(map);
			el.addEventListener('click', () => updateSelectedMarker(index));
		});
	} else {
		console.error('Invalid markers data:', markersData);
	}

	// Bind click events for external marker icons
	markerIcons.forEach((icon, index) => {
		icon.addEventListener('click', () => updateSelectedMarker(index, true));
	});

	// Bind the fit bounds functionality to the corresponding button/icon
	const fitBoundsButton = mapElement.querySelector(
		'.blockons-map-icon.fitbounds',
	);
	if (fitBoundsButton) {
		fitBoundsButton.addEventListener('click', fitBoundsToMarkers);
	}

	// Initialize icons and marker classes on load
	updateIcons();

	// If a marker is preselected, ensure its info block is shown correctly.
	if (selectedMarkerIndex !== null) {
		updateIcons();
		updateMarkerInfo();
	}
}
