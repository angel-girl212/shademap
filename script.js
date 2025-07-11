const map = L.map('map').setView([43.637869, -79.406311], 13);
const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
  attribution: '© Esri' 
});

let currentBase = 'satellite';
satellite.addTo(map);

function setBaseLayer(name) {
  map.removeLayer(street);
  map.removeLayer(satellite);
  if (name === 'street') {
    street.addTo(map);
    currentBase = 'street';
  } else {
    satellite.addTo(map);
    currentBase = 'satellite';
  }
}

let boundaryLayer;

L.Control.geocoder({
  defaultMarkGeocode: false,
  position: 'topright'
})
  .on('markgeocode', e => {
    const latlng = e.geocode.center;
    map.setView(latlng, 16);
  })
  .addTo(map);

map.createPane('topPane');
map.getPane('topPane').style.zIndex = 650;

fetch('toronto_bound.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response error');
    return response.json();
  })
  .then(data => {
    boundaryLayer = L.geoJSON(data, {
      pane: 'topPane',
      style: {
        color: "#ffd300",
        weight: 4,
        fillOpacity: 0
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup("Toronto Regional Boundary");
      }  
    }).addTo(map);
  })
  .catch(error => {
    console.error("Failed to load JSON:", error);
  });

const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const marker = L.marker([43.637869, -79.406311], {icon: goldIcon}).addTo(map);
marker.bindPopup("<b>The Bentway</b><br>250 Fort York").openPopup();

function add(e) {
  if (!boundaryLayer) {
    alert("Boundary not loaded yet.");
    return;
  }

  const clickPoint = turf.point([e.latlng.lng, e.latlng.lat]);

  const isInside = boundaryLayer.toGeoJSON().features.some(feature => {
    if (!feature.geometry) return false;

    const geometry = feature.geometry;

    let coords = geometry.coordinates;
    if (
      coords.length > 2 &&
      (coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1])
    ) {
      coords = [...coords, coords[0]];
    }
    try {
      const poly = turf.polygon([coords]);
      return turf.booleanPointInPolygon(clickPoint, poly);
    } catch (err) {
      console.error("Error checking LineString converted to Polygon:", err);
      return false;
    }

    // Add other geometry types if needed
    return false;
  });

  if (!isInside) {
    alert("Submission out of range. Please submit your shady spot within the Toronto Regional Boundary");
    return;
  }

  const markerName = prompt(`You clicked a spot at ${e.latlng.lat.toFixed(5)} and ${e.latlng.lng.toFixed(5)}. Add a name to submit`);
  if (markerName) {
    const description = prompt(`Describe your shady spot`);
    const choice = prompt("What time do you benefit from this shady space:\n1. Morning\n2. Midday\n3. Evening\n4. Night", "");

    let timeday = "";
    switch (choice) {
      case "1": timeday = "Morning"; break;
      case "2": timeday = "Midday"; break;
      case "3": timeday = "Evening"; break;
      case "4": timeday = "Night"; break;
      default:
        alert("Invalid input");
        return;
    }

    const marker = L.marker(e.latlng, {icon: goldIcon}).addTo(map);
    marker.bindPopup(`<b>${markerName}</b><br>${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`).openPopup();
    sendToForm(e, markerName, description, timeday);
  }
}

function sendToForm(e, markerName, description, timeday) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);

  const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeLNCRMgVfrD8zpB_4Vkr07lnyRmP09fHVtlWBpLwaEnCbnnw/formResponse";
  const formData = new URLSearchParams();
  formData.append("entry.1103269963", lat);
  formData.append("entry.122135591", lng);
  formData.append("entry.2085927347", markerName);
  formData.append("entry.656970841", description);
  formData.append("entry.635360372", timeday);

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).catch(err => console.error("Error:", err));
}

map.on('click', add);
