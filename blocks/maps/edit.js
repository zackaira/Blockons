import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	TextControl,
	RangeControl,
	SelectControl,
	Button,
	ToolbarButton,
	Dropdown,
} from '@wordpress/components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette } from '../block-global';
import BlockonsNote from '../../src/backend/settings/components/UI/BlockonsNote';

const DEFAULT_LAT = -33.9249; // CT
const DEFAULT_LNG = 18.4241;

const Edit = (props) => {
	const {
		attributes: {
			mapLatitude,
			mapLongitude,
			markers,
			selectedMarker,
			zoom,
			height,
			showMarkerInfo,
			showMarkerIcons,
			showControls,
			markerStyle,
			markersColor,
			markersBgColor,
			isPremium,
		},
		setAttributes,
	} = props;
	const apiUrl = blockonsEditorObj.apiUrl;
	const isPro = Boolean(blockonsEditorObj.isPremium);

	const [enableMap, setEnableMap] = useState(false);
	const [mapboxToken, setMapboxToken] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [tempLat, setTempLat] = useState(mapLatitude);
	const [tempLng, setTempLng] = useState(mapLongitude);
	const mapContainerRef = useRef(null);
	const mapRef = useRef(null);
	const markerRefs = useRef([]);

	// Fetch the Mapbox API key from your endpoint on mount.
	useEffect(() => {
		setAttributes({ isPremium: isPro }); // SETS PREMIUM

		async function fetchToken() {
			try {
				const response = await fetch(
					`${apiUrl}blcns/v1/get-api-key?key_type=maps`,
					{
						headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': blockonsEditorObj.nonce,
						},
					},
				);
				const data = await response.json();
				if (data.api_key) {
					setMapboxToken(data.api_key);
				} else {
					setMapboxToken(0);
					console.error('No API key returned from endpoint.');
				}
			} catch (err) {
				console.error('Error fetching Mapbox API key:', err);
			}
		}
		fetchToken();
	}, []);

	const getUserLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					setAttributes({
						mapLatitude: parseFloat(latitude.toFixed(6)),
						mapLongitude: parseFloat(longitude.toFixed(6)),
					});
				},
				() => {
					setAttributes({
						mapLatitude: DEFAULT_LAT,
						mapLongitude: DEFAULT_LNG,
					});
				},
				{ enableHighAccuracy: true },
			);
		}
	};

	useEffect(() => {
		if (mapLatitude === '' || mapLongitude === '') {
			getUserLocation();
		}
	}, []);

	useEffect(() => {
		if (enableMap && mapContainerRef.current) {
			mapboxgl.accessToken = mapboxToken;

			const initialLat = mapLatitude || DEFAULT_LAT;
			const initialLng = mapLongitude || DEFAULT_LNG;

			if (!mapRef.current) {
				mapRef.current = new mapboxgl.Map({
					container: mapContainerRef.current,
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [initialLng, initialLat],
					zoom: zoom,
				});

				mapRef.current.on('moveend', () => {
					const center = mapRef.current.getCenter();
					setTempLat(parseFloat(center.lat.toFixed(6)));
					setTempLng(parseFloat(center.lng.toFixed(6)));
				});

				mapRef.current.on('zoomend', () => {
					const newZoom = mapRef.current.getZoom();
					setAttributes({ zoom: parseFloat(newZoom.toFixed(1)) });
				});
			}
		}
	}, [enableMap, mapLatitude, mapLongitude]);

	const updateIconSelection = () => {
		document
			.querySelectorAll('.blockons-map-marker-info blockons-map-icon')
			.forEach((icon, index) => {
				icon.classList.toggle('selected', selectedMarker === index);
				icon.style.backgroundColor =
					selectedMarker === index
						? markers[index]?.iconColor || markersColor
						: '#fff';
				icon.style.color =
					selectedMarker === index
						? '#fff'
						: markers[index]?.iconColor || markersColor;
			});
	};

	useEffect(() => {
		updateIconSelection();
	}, [selectedMarker, markers]);

	useEffect(() => {
		if (!isPremium && selectedMarker !== 0) {
			selectMarker(null);
		}
	}, [isPremium]);

	const selectMarker = (index) => {
		setAttributes({
			selectedMarker: selectedMarker === index ? null : index,
		});
	};

	const findLocation = async () => {
		if (!searchQuery.trim()) return;

		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
			searchQuery,
		)}.json?access_token=${mapboxToken}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.features.length > 0) {
				const { center } = data.features[0];

				if (mapRef.current) {
					mapRef.current.flyTo({
						center,
						zoom: 14,
						speed: 1.2,
						curve: 1.5,
						essential: true,
					});
				}
			}
		} catch (error) {
			console.error('Error fetching location:', error);
		}
	};

	const findMyLocation = () => {
		if (mapLatitude === '' || mapLongitude === '') {
			getUserLocation();
		} else if (mapRef.current) {
			mapRef.current.flyTo({
				center: [mapLongitude, mapLatitude],
				speed: 1.2,
				curve: 1.5,
				essential: true,
				zoom: 14,
			});
		}
	};

	useEffect(() => {
		if ((enableMap, mapRef.current)) {
			updateMarkersOnMap();
		}
	}, [enableMap, markers, selectedMarker]);

	const updateMarkersOnMap = () => {
		if (!mapRef.current) return;
		markerRefs.current.forEach((marker) => marker.remove());
		markerRefs.current = [];

		const markersToDisplay = isPremium ? markers : markers.slice(0, 1);
		markersToDisplay.forEach((marker, index) =>
			addMarkerToMap(marker, index),
		);
	};

	const autoCenterMap = () => {
		if (!mapRef.current || markers.length === 0) return;

		const markersToDisplay = isPremium ? markers : markers.slice(0, 1);

		if (markers.length === 1) {
			mapRef.current.setCenter([
				markers[0].longitude,
				markers[0].latitude,
			]);
		} else {
			const bounds = new mapboxgl.LngLatBounds();
			markersToDisplay.forEach((marker) =>
				bounds.extend([marker.longitude, marker.latitude]),
			);
			mapRef.current.fitBounds(bounds, { padding: 100, maxZoom: 15 });
		}
	};

	const addMarkerToMap = (marker, index) => {
		if (!mapRef.current) return;

		const markerElement = document.createElement('div');
		markerElement.className = `blockons-map-marker ${marker.icon || 'fas fa-map-marker-alt'}`;
		markerElement.style.color = marker.iconColor || markersColor;
		markerElement.style.backgroundColor =
			marker.iconBgColor || markersBgColor;

		if (index === selectedMarker) {
			markerElement.classList.add('selected');
		}

		const newMarker = new mapboxgl.Marker({
			element: markerElement,
			draggable: true,
		})
			.setLngLat([marker.longitude, marker.latitude])
			.addTo(mapRef.current);

		newMarker.getElement().addEventListener('click', () => {
			selectMarker(index);
		});

		newMarker.on('dragend', () => {
			const lngLat = newMarker.getLngLat();
			const updatedMarkers = [...markers];

			updatedMarkers[index] = {
				...updatedMarkers[index], // Preserve existing data
				latitude: parseFloat(lngLat.lat.toFixed(6)),
				longitude: parseFloat(lngLat.lng.toFixed(6)),
			};

			setAttributes({ markers: updatedMarkers });

			mapRef.current.panTo([lngLat.lng, lngLat.lat]);
		});

		markerRefs.current[index] = newMarker;
	};

	const updateSelectedMarker = (field, value) => {
		if (selectedMarker === null || !markers[selectedMarker]) return;

		const updatedMarkers = [...markers];
		updatedMarkers[selectedMarker] = {
			...updatedMarkers[selectedMarker],
			[field]: value,
		};

		setAttributes({ markers: updatedMarkers });
	};

	const updateMarkerDetails = (index, field, value) => {
		const updatedMarkers = [...markers];
		updatedMarkers[index] = { ...updatedMarkers[index], [field]: value };
		setAttributes({ markers: updatedMarkers });

		if (markerRefs.current[index]) {
			const markerElement = markerRefs.current[index].getElement();

			if (field === 'icon') {
				markerElement.className = `blockons-map-marker ${value}`;
			}

			if (field === 'iconColor') {
				markerElement.style.color = value;
			}

			if (field === 'iconBgColor') {
				markerElement.style.backgroundColor = value;
			}
		}
	};

	const addMarker = () => {
		if (!mapRef.current) return;

		const center = mapRef.current.getCenter();
		const newMarker = {
			latitude: center.lat,
			longitude: center.lng,
			title: 'Place Name',
			description: 'Place Description & Details',
			icon: 'fas fa-map-marker-alt',
			iconColor: markersColor,
			iconBgColor: markerStyle === 'two' ? markersBgColor : '#FFFFFF',
		};

		const updatedMarkers = [...markers, newMarker];
		setAttributes({ markers: updatedMarkers });

		addMarkerToMap(newMarker, updatedMarkers.length - 1);

		mapRef.current.panTo([center.lng, center.lat]);
	};

	const deleteMarker = (index) => {
		if (
			!window.confirm(
				__('Are you sure you want to delete this marker?', 'blockons'),
			)
		) {
			return;
		}

		const updatedMarkers = [...markers];
		updatedMarkers.splice(index, 1);
		setAttributes({ markers: updatedMarkers });

		if (markerRefs.current[index]) {
			markerRefs.current[index].remove();
			markerRefs.current.splice(index, 1);
		}

		if (updatedMarkers.length > 0 && mapRef.current) {
			const lastMarker = updatedMarkers[updatedMarkers.length - 1];
			mapRef.current.flyTo({
				center: [lastMarker.longitude, lastMarker.latitude],
				zoom: zoom,
				speed: 1.2,
				curve: 1.5,
				essential: true,
			});
		}
	};

	const zoomToViewAllMarkers = () => {
		if (!mapRef.current) return;

		autoCenterMap();
	};

	const viewSavedPosition = () => {
		if (!mapRef.current) return;

		mapRef.current.flyTo({
			center: [mapLongitude, mapLatitude],
			// zoom: zoom,
			speed: 1.2,
			curve: 1.5,
			essential: true,
		});

		setTempLat(mapLatitude);
		setTempLng(mapLongitude);
	};

	const saveMapPosition = () => {
		setAttributes({
			mapLatitude: tempLat,
			mapLongitude: tempLng,
		});
	};

	if (mapboxToken === 0) {
		return (
			<div>
				<a href="" target="_blank">
					{__(
						'Please enter a Mapbox API key in the plugin settings.',
						'blockons',
					)}
				</a>
			</div>
		);
	}

	const markersToDisplay = isPremium ? markers : markers.slice(0, 1);

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody
					title={__('Mapbox Settings', 'blockons')}
					initialOpen={true}
				>
					{enableMap ? (
						<>
							<div className="blockons-marker-setsplit">
								<TextControl
									label={__('Latitude', 'blockons')}
									value={tempLat}
									disabled
								/>
								<TextControl
									label={__('Longitude', 'blockons')}
									value={tempLng}
									disabled
								/>
							</div>
							<div className="blockons-marker-setsplit">
								<Button
									variant="primary"
									onClick={saveMapPosition}
									style={{
										backgroundColor:
											tempLat !== mapLatitude ||
											tempLng !== mapLongitude
												? '#1b7cba'
												: '#888',
									}}
								>
									{tempLat !== mapLatitude ||
									tempLng !== mapLongitude
										? __(
												'Update Saved Coordinates',
												'blockons',
											)
										: __('Saved Coordinates', 'blockons')}
								</Button>
								<Button
									variant="primary"
									onClick={viewSavedPosition}
									icon={
										<span className="dashicons dashicons-location"></span>
									}
									title={__(
										'View Saved Map Coordinates',
										'blockons',
									)}
								/>
							</div>
							<br />
							<p className="helplink">
								{__(
									'Save coordinates before saving the page.',
									'blockons',
								)}
							</p>
							<div className="blockons-divider"></div>

							<TextControl
								label={__('Search Location', 'blockons')}
								value={searchQuery}
								onChange={(value) => setSearchQuery(value)}
								placeholder={__(
									'Search for a location...',
									'blockons',
								)}
								onKeyDown={(event) => {
									if (event.key === 'Enter') {
										event.preventDefault();
										findLocation();
									}
								}}
							/>

							<div className="blockons-marker-setsplit">
								<Button
									variant="primary"
									onClick={() => {
										if (searchQuery.trim()) {
											findLocation(); // Search for entered text
										} else {
											findMyLocation(); // Get current location
										}
									}}
								>
									{searchQuery.trim()
										? __('Find Location', 'blockons')
										: __('Get My Location', 'blockons')}
								</Button>

								{isPremium ||
								(!isPremium && markers.length < 1) ? (
									<Button
										variant="primary"
										onClick={addMarker}
										className="blockons-add-marker"
									>
										{__('Add Marker', 'blockons')}
									</Button>
								) : (
									<i></i>
								)}
							</div>
							<div className="blockons-divider"></div>

							{!isPremium && markers.length > 0 && (
								<BlockonsNote
									title={__(
										'Add Multiple Map Icons',
										'blockons',
									)}
									text={__(
										'Upgrade to Blockons Pro and add as many icons to the map as you need.',
										'blockons',
									)}
									proFeatures={[
										__('Multiple Map Icons', 'blockons'),
										__(
											'Switch from icon to icon viewing different information',
											'blockons',
										),
										__(
											'Color each marker separately',
											'blockons',
										),
										__(
											'Extra Zoom control to view all markers',
											'blockons',
										),
									]}
									docLink="https://blockons.com/documentation/maps-block/#maps-pro"
									upgradeLink={blockonsEditorObj.upgradeUrl}
								/>
							)}

							{markersToDisplay.map((marker, index) => (
								<div
									key={index}
									className="blockons-mapbox-markers"
								>
									<Dropdown
										className="blockons-mapbox-markers-dropdown"
										contentClassName="blockons-mapbox-markers-editor"
										renderToggle={({
											isOpen,
											onToggle,
										}) => (
											<div className="blockons-mapbox-marker-item">
												<h5
													onClick={() => {
														selectMarker(index);
														mapRef.current.panTo([
															marker.longitude,
															marker.latitude,
														]);
														onToggle();
													}}
													style={{
														color: marker.iconColor,
													}}
												>
													{marker.title
														? marker.title
														: marker.description
															? marker.description
															: __(
																	'No Info',
																	'blockons',
																)}
												</h5>
												<ToolbarButton
													icon={
														<span className="dashicons dashicons-edit"></span>
													}
													title={__(
														'Edit',
														'blockons',
													)}
													onClick={() => {
														selectMarker(index);
														mapRef.current.panTo([
															marker.longitude,
															marker.latitude,
														]);
														onToggle();
													}}
													isActive={isOpen}
												/>
												<ToolbarButton
													icon={
														<span className="dashicons dashicons-trash"></span>
													}
													title={__(
														'Delete',
														'blockons',
													)}
													onClick={() =>
														deleteMarker(index)
													}
												/>
											</div>
										)}
										renderContent={() => (
											<>
												<div className="blockons-marker-setsplit">
													<TextControl
														label={__(
															'Latitude',
															'blockons',
														)}
														value={marker.latitude}
														disabled
													/>
													<TextControl
														label={__(
															'Longitude',
															'blockons',
														)}
														value={marker.longitude}
														disabled
													/>
												</div>
												<div className="blockons-divider"></div>

												<TextControl
													label={__(
														'Icon (FontAwesome Class)',
														'blockons',
													)}
													value={marker.icon}
													onChange={(value) =>
														updateMarkerDetails(
															index,
															'icon',
															value,
														)
													}
												/>

												<BlockonsColorpicker
													label={__(
														'Icon Color',
														'blockons',
													)}
													value={marker.iconColor}
													onChange={(value) =>
														updateMarkerDetails(
															index,
															'iconColor',
															value,
														)
													}
													paletteColors={
														colorPickerPalette
													}
												/>
												{markerStyle === 'two' && (
													<BlockonsColorpicker
														label={__(
															'Marker Background Color',
															'blockons',
														)}
														value={
															marker.iconBgColor
														}
														onChange={(value) =>
															updateMarkerDetails(
																index,
																'iconBgColor',
																value,
															)
														}
														paletteColors={
															colorPickerPalette
														}
													/>
												)}
											</>
										)}
									/>
								</div>
							))}
							{markers.length > 0 && (
								<div className="blockons-divider"></div>
							)}

							<RangeControl
								label={__('Map Height (px)', 'blockons')}
								value={height}
								onChange={(value) =>
									setAttributes({ height: value })
								}
								onMouseLeave={() =>
									mapRef.current && mapRef.current.resize()
								}
								min={100}
								max={800}
							/>
							<div className="blockons-divider"></div>

							<RangeControl
								label={__('Zoom Level', 'blockons')}
								value={zoom}
								onChange={(value) => {
									setAttributes({ zoom: parseFloat(value) });
									if (mapRef.current) {
										mapRef.current.setZoom(
											parseFloat(value),
										);
									}
								}}
								min={4}
								max={18}
							/>
							<div className="blockons-divider"></div>

							<ToggleControl
								label={__('Show Marker Info Box', 'blockons')}
								checked={showMarkerInfo}
								onChange={(value) =>
									setAttributes({ showMarkerInfo: value })
								}
							/>
							<div className="blockons-divider"></div>

							<ToggleControl
								label={__('Show Marker Icons', 'blockons')}
								checked={showMarkerIcons}
								onChange={(value) =>
									setAttributes({ showMarkerIcons: value })
								}
							/>
							<ToggleControl
								label={__('Show Map Controls', 'blockons')}
								checked={showControls}
								onChange={(value) =>
									setAttributes({ showControls: value })
								}
							/>
							<div className="blockons-divider"></div>

							<SelectControl
								label={__('Marker Style', 'blockons')}
								value={markerStyle}
								options={[
									{
										label: __('Plain Markers', 'blockons'),
										value: 'one',
									},
									{
										label: __('Round', 'blockons'),
										value: 'two',
									},
								]}
								onChange={(value) =>
									setAttributes({
										markerStyle: value,
									})
								}
							/>

							<BlockonsColorpicker
								label={__('Marker Color', 'blockons')}
								value={markersColor}
								onChange={(value) =>
									setAttributes({
										markersColor:
											value === undefined
												? '#b30a57'
												: value,
									})
								}
								paletteColors={colorPickerPalette}
							/>
							{markerStyle === 'two' && (
								<BlockonsColorpicker
									label={__(
										'Marker Background Color',
										'blockons',
									)}
									value={markersBgColor}
									onChange={(value) =>
										setAttributes({
											markersBgColor:
												value === undefined
													? '#FFFFFF'
													: value,
										})
									}
									paletteColors={colorPickerPalette}
								/>
							)}
						</>
					) : (
						<Button
							variant="primary"
							onClick={() => setEnableMap(true)}
							disabled={!mapboxToken}
						>
							{mapboxToken
								? __('Click to Use Map', 'blockons')
								: __('Loading...', 'blockons')}
						</Button>
					)}
				</PanelBody>
			</InspectorControls>

			<div
				ref={mapContainerRef}
				className={`blockons-mapbox ${enableMap ? 'usemap' : 'nomap'} marker-style-${markerStyle}`}
				style={{ height: `${height}px` }}
			>
				{enableMap && (
					<>
						{markers.length > 0 && (
							<div className="blockons-map-marker-info">
								{showMarkerIcons && (
									<div className="blockons-map-icons">
										{markersToDisplay.map(
											(marker, index) => (
												<div
													key={index}
													className={`blockons-map-icon ${selectedMarker === index ? 'selected' : ''}`}
													onClick={() => {
														selectMarker(index);
														mapRef.current.panTo([
															marker.longitude,
															marker.latitude,
														]);
													}}
													style={
														selectedMarker === index
															? {
																	backgroundColor:
																		marker.iconColor,
																}
															: {
																	color: marker.iconColor,
																}
													}
												>
													<span
														className={marker.icon}
													></span>
												</div>
											),
										)}
									</div>
								)}

								{showMarkerInfo && selectedMarker !== null && (
									<div className="blockons-marker-infoblock">
										<div
											className="blockons-marker-close-infoblock fas fa-xmark"
											onClick={() => selectMarker(null)}
										></div>

										<RichText
											tagName="h6"
											value={
												markers[selectedMarker]
													?.title || ''
											}
											onChange={(value) =>
												updateSelectedMarker(
													'title',
													value,
												)
											}
											placeholder={__(
												'Place Name...',
												'blockons',
											)}
											allowedFormats={[]}
										/>
										<RichText
											tagName="p"
											value={
												markers[selectedMarker]
													?.description || ''
											}
											onChange={(value) =>
												updateSelectedMarker(
													'description',
													value,
												)
											}
											placeholder={__(
												'Place Description & Details...',
												'blockons',
											)}
										/>
									</div>
								)}
							</div>
						)}

						{showControls && (
							<div className="blockons-map-controls">
								{markers.length > 0 && (
									<div
										className="blockons-map-icon fitbounds"
										onClick={zoomToViewAllMarkers}
									>
										<span className="fas fa-expand"></span>
									</div>
								)}
							</div>
						)}
					</>
				)}

				{!enableMap && (
					<div className={`blockons-mapbox-disable`}>
						<Button
							variant="primary"
							onClick={() => setEnableMap(true)}
							disabled={!mapboxToken}
						>
							{mapboxToken
								? __('Click to Use Map', 'blockons')
								: __('Loading...', 'blockons')}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
