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
};

window.addEventListener("load", main);
