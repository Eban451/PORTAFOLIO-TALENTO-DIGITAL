"use strict";


const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZWJhbjQ1MSIsImEiOiJjbGRqZHMxdjMxbDcwM3Zud3R4MzlzcXpyIn0.j9_EDxaSrv_BG237kKutGQ";
// Mapbox Docs example - https://docs.mapbox.com/mapbox-gl-js/example/simple-map/

// This function is run on window 'load' event, once all scripts in the html file are loaded
const main = () => {
    // Set the Mapbox API access token
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
        container: "map", // container id
        center: [-71.61, -33.04], // starting position [lng, lat]
        zoom: 13, // starting zoom
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        // style: "mapbox://styles/mapbox/light-v10"
        // style: "mapbox://styles/mapbox/streets-v11"
        // style: "mapbox://styles/mapbox/satellite-v9"

        /* More details on setting the map styles:
          https://docs.mapbox.com/mapbox-gl-js/examples/#styles
        */
    });

    let markersVisible = true;

    // axios
    //     .get("http://localhost:4000/api/v1/puntos")
    //     .then((result) => {
    //         // Add the data to the map as a source with ID 'places'
    //         map.addSource("places", {
    //             type: "geojson",
    //             data: result.data,
    //         });

    //         // Add a layer to the map
    //         map.addLayer({
    //             id: "places",
    //             type: "circle",
    //             source: "places",
    //             paint: {
    //                 "circle-color": "#4264fb",
    //                 "circle-radius": 6,
    //                 "circle-stroke-width": 2,
    //                 "circle-stroke-color": "#ffffff",
    //             },
    //         });

    //         console.log(result.data);
    //     })
    //     .catch((err) => console.error(err));

    // axios
    //     .get("http://localhost:4000/api/v1/puntos5")
    //     .then((result) => {
    //         // Add the data to the map as a source with ID 'places'
    //         map.addSource("places2", {
    //             type: "geojson",
    //             data: result.data,
    //         });

    //         // Add a layer to the map
    //         map.addLayer({
    //             id: "places2",
    //             type: "circle",
    //             source: "places2",
    //             paint: {
    //                 "circle-color": "#4264fb",
    //                 "circle-radius": 6,
    //                 "circle-stroke-width": 2,
    //                 "circle-stroke-color": "#ffffff",
    //             },
    //         });

    //         console.log(result.data);
    //     })
    //     .catch((err) => console.error(err));

    // axios
    //     .get("http://localhost:4000/api/v1/puntos6")
    //     .then((result) => {
    //         // Add the data to the map as a source with ID 'places'
    //         map.addSource("places3", {
    //             type: "geojson",
    //             data: result.data,
    //         });

    //         // Add a layer to the map
    //         map.addLayer({
    //             id: "places3",
    //             type: "circle",
    //             source: "places3",
    //             paint: {
    //                 "circle-color": "#4264fb",
    //                 "circle-radius": 6,
    //                 "circle-stroke-width": 2,
    //                 "circle-stroke-color": "#ffffff",
    //             },
    //         });

    //         console.log(result.data);
    //     })
    //     .catch((err) => console.error(err));


    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    //MAP ONLOAD 1

    map.on('load', () => {
        // Add event listeners for mouseenter and mouseleave on the 'places' layer
        map.on('mouseenter', 'places', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = ` ${e.features[0].properties.nombre}
     <img src="${e.features[0].properties.img}">
      Dirección: ${e.features[0].properties.Direccion}
      Horario: ${e.features[0].properties.Horario}      `;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });

    //MAP ONLOAD 2

    map.on('load', () => {
        // Add event listeners for mouseenter and mouseleave on the 'places' layer
        map.on('mouseenter', 'places2', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = ` ${e.features[0].properties.nombre}
     <img src="${e.features[0].properties.img}">
      Dirección: ${e.features[0].properties.Direccion}
      Horario: ${e.features[0].properties.Horario}      `;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', 'places2', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });

    // MAP ONLOAD 3

    map.on('load', () => {
        // Add event listeners for mouseenter and mouseleave on the 'places' layer
        map.on('mouseenter', 'places3', (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = ` ${e.features[0].properties.nombre}
     <img src="${e.features[0].properties.img}">
      Dirección: ${e.features[0].properties.Direccion}
      Horario: ${e.features[0].properties.Horario}      `;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', 'places3', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });

    // FUNCIONAMIENTO BOTONES

    // Get the button element by id
    const toggleMarkersButton = document.getElementById('toggleMarkers');
    const toggleMarkersButton2 = document.getElementById('toggleMarkers2');
    const toggleMarkersButton3 = document.getElementById('toggleMarkers3');

    // Add event listener to the button MUSEOS
    toggleMarkersButton.addEventListener('click', () => {
        // Check if the 'places' layer is currently visible
        const placesLayer = map.getLayer('places');
        if (placesLayer) {
            // If the layer is visible, remove it from the map
            map.removeLayer('places');
            map.removeSource('places');

            // Remove the "active" class from the button
            toggleMarkersButton.classList.remove('active');
        } else {
            // If the layer is not visible, fetch the GeoJSON data and add it to the map as a source and layer
            axios
                .get("http://localhost:4000/api/v1/puntos")
                .then((result) => {
                    // Add the data to the map as a source with ID 'places'
                    map.addSource("places", {
                        type: "geojson",
                        data: result.data,
                    });

                    // Add a layer to the map
                    map.addLayer({
                        id: "places",
                        type: "circle",
                        source: "places",
                        paint: {
                            "circle-color": "#4264fb",
                            "circle-radius": 6,
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#ffffff",
                        },
                    });

                    console.log(result.data);
                })
                .catch((err) => console.error(err));

            // Add the "active" class to the button
            toggleMarkersButton.classList.add('active');
        }
    });

    // Add event listener to the button PLAZAS Y PARQUES
    toggleMarkersButton2.addEventListener('click', () => {
        // Check if the 'places2' layer is currently visible
        const placesLayer2 = map.getLayer('places2');
        if (placesLayer2) {
            // If the layer is visible, remove it from the map
            map.removeLayer('places2');
            map.removeSource('places2');

            // Remove the "active" class from the button
            toggleMarkersButton2.classList.remove('active');
        } else {
            // If the layer is not visible, fetch the GeoJSON data and add it to the map as a source and layer
            axios
                .get("http://localhost:4000/api/v1/puntos5")
                .then((result) => {
                    // Add the data to the map as a source with ID 'places2'
                    map.addSource("places2", {
                        type: "geojson",
                        data: result.data,
                    });

                    // Add a layer to the map
                    map.addLayer({
                        id: "places2",
                        type: "circle",
                        source: "places2",
                        paint: {
                            "circle-color": "#4264fb",
                            "circle-radius": 6,
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#ffffff",
                        },
                    });

                    console.log(result.data);
                })
                .catch((err) => console.error(err));

            // Add the "active" class to the button
            toggleMarkersButton2.classList.add('active');
        }
    });

    // Add event listener to the button SERVICIOS
    toggleMarkersButton3.addEventListener('click', () => {
        // Check if the 'places2' layer is currently visible
        const placesLayer3 = map.getLayer('places3');
        if (placesLayer3) {
            // If the layer is visible, remove it from the map
            map.removeLayer('places3');
            map.removeSource('places3');

            // Remove the "active" class from the button
            toggleMarkersButton3.classList.remove('active');
        } else {
            // If the layer is not visible, fetch the GeoJSON data and add it to the map as a source and layer
            axios
                .get("http://localhost:4000/api/v1/puntos6")
                .then((result) => {
                    // Add the data to the map as a source with ID 'places2'
                    map.addSource("places3", {
                        type: "geojson",
                        data: result.data,
                    });

                    // Add a layer to the map
                    map.addLayer({
                        id: "places3",
                        type: "circle",
                        source: "places3",
                        paint: {
                            "circle-color": "#4264fb",
                            "circle-radius": 6,
                            "circle-stroke-width": 2,
                            "circle-stroke-color": "#ffffff",
                        },
                    });

                    console.log(result.data);
                })
                .catch((err) => console.error(err));

            // Add the "active" class to the button
            toggleMarkersButton3.classList.add('active');
        }
    });


    // CAPTAR COORDENADAS

    const locationBtn = document.getElementById('location-btn');

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                start[0] = position.coords.longitude;
                start[1] = position.coords.latitude;
                getRoute(start);
                // update the starting point on the map
                map.getSource('point').setData({
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'Point',
                                coordinates: start
                            }
                        }
                    ]
                });
                geolocate.trigger(); // trigger geolocation control
            }, error => console.error(error));
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    });

    // an arbitrary start will always be the same
    // only the end or destination will change
    const start = [];

    // this is where the code for the next step will go

    // create a function to make a directions request
    async function getRoute(end) {
        // make a directions request using cycling profile
        // an arbitrary start will always be the same
        // only the end or destination will change
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&language=es&geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: geojson
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }
        // get the sidebar and add the instructions
        const instructions = document.getElementById('instructions');
        const steps = data.legs[0].steps;

        let tripInstructions = '';
        for (const step of steps) {
            tripInstructions += `<li>${step.maneuver.instruction}</li>`;
        }
        instructions.innerHTML = `<p><strong>Duración del recorrido: ${Math.floor(
            data.duration / 60
        )} min 🚶 </strong></p><ol>${tripInstructions}</ol>`;

    }

    map.on('load', () => {
        // make an initial directions request that
        // starts and ends at the same location
        getRoute(start);

        // Add destination to the map
        map.addLayer({
            'id': 'point',
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': start
                            }
                        }
                    ]
                }
            },
            'paint': {
                'circle-radius': 10,
                'circle-color': '#3887be'
            }
        });

        // allow the user to click the map to change the destination
        map.on('click', (event) => {
            const coords = Object.keys(event.lngLat).map(
                (key) => event.lngLat[key]
            );
            const end = {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'Point',
                            'coordinates': coords
                        }
                    }
                ]
            };
            if (map.getLayer('end')) {
                map.getSource('end').setData(end);
            } else {
                map.addLayer({
                    'id': 'end',
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'properties': {},
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': coords
                                    }
                                }
                            ]
                        }
                    },
                    'paint': {
                        'circle-radius': 10,
                        'circle-color': '#f30'
                    }
                });
            }
            getRoute(coords);
        });
    });

    /////

    var geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });

    // Add the control to the map.
    map.addControl(geolocate, 'bottom-right');


};

window.addEventListener("load", main);

// Get the button element
var locationBtn = document.getElementById("location-btn");

// Listen for window resize events
window.addEventListener("resize", function () {
    // Get the current screen width
    var screenWidth = window.innerWidth;

    // If the screen width is less than or equal to 576 pixels
    if (screenWidth <= 576) {
        // Change the button text
        locationBtn.textContent = "Ubicación";
    } else {
        // Reset the button text
        locationBtn.textContent = "Usar mi localización";
    }
});