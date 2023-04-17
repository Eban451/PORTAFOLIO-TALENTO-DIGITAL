mapboxgl.accessToken = 'pk.eyJ1IjoiZWJhbjQ1MSIsImEiOiJjbGRqZHMxdjMxbDcwM3Zud3R4MzlzcXpyIn0.j9_EDxaSrv_BG237kKutGQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-71.61, -33.04], // starting position [lng, lat]
    zoom: 13, // starting zoom
    language: 'es'
});

import { pool } from "../dbConfig.js";

router.get('/admin/control', (req, res) => {
    const query = 'SELECT id, nombre, img, direccion, horario, ST_AsGeoJSON(geom) FROM museums';
  
    pool.query(query)
      .then((result) => {
        const rows = result.rows.map((row) => {
          const { coordinates } = JSON.parse(row.st_asgeojson);
          return {
            id: row.id,
            nombre: row.nombre,
            img: row.img,
            direccion: row.direccion,
            horario: row.horario,
            coordinates,
          };
        });
        res.render('admin', { rows });
        console.log(rows.map((row) => row.coordinates));
      })
      .catch((err) => {
        console.error('Error fetching data from PostgreSQL database', err);
      });
  });

let markersVisible = true;


// Fetch GeoJSON data
fetch('puntos.geojson')
    .then(response => response.json())
    .then(data => {
        // Add the data to the map as a source with ID 'places'
        map.addSource('places', {
            'type': 'geojson',
            'data': data // Replace with the fetched GeoJSON data
        });

        // Add a layer to the map
        map.addLayer({
            'id': 'places',
            'type': 'circle',
            'source': 'places',
            'paint': {
                'circle-color': '#4264fb',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        console.log(data);
    })
    .catch(error => console.error('Error fetching GeoJSON data:', error));

// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

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




// Get the button element by id
const toggleMarkersButton = document.getElementById('toggleMarkers');

// Add event listener to the button
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
        fetch('puntos.geojson')
            .then(response => response.json())
            .then(data => {
                // Add the data to the map as a source with ID 'places'
                map.addSource('places', {
                    'type': 'geojson',
                    'data': data // Replace with the fetched GeoJSON data
                });

                // Add a layer to the map
                map.addLayer({
                    'id': 'places',
                    'type': 'circle',
                    'source': 'places',
                    'paint': {
                        'circle-color': '#4264fb',
                        'circle-radius': 6,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff'
                    }
                });

                console.log(data);
            })
            .catch(error => console.error('Error fetching GeoJSON data:', error));

        // Add the "active" class to the button
        toggleMarkersButton.classList.add('active');
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



