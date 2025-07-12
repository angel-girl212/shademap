const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
  maxZoom: 25,
  attribution: '© Esri' 
});

const street = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 25,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

const map = L.map('map', {
  center: [43.637869, -79.406311],
  zoom: 13,
  layers: [street, satellite]
});

const baseMaps = {
  'Street View': street,
  'Satellite View': satellite
};   

map.createPane('topPane');
map.getPane('topPane').style.zIndex = 650;

let boundaryLayer;

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
        fillOpacity: 0,
        dashArray: '6, 6'
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

const layerControl = L.control.layers(baseMaps).addTo(map);

L.Control.geocoder({
  defaultMarkGeocode: false,
  position: 'topleft'
})
.on('markgeocode', e => {
  const latlng = e.geocode.center;
  map.setView(latlng, 16);
})
.addTo(map);

function add(e) {
  if (!boundaryLayer) {
    alert("Boundary data not yet loaded. Please try again in a moment.");
    return;
  }

  const clickPoint = turf.point([e.latlng.lng, e.latlng.lat]);

  const isInside = boundaryLayer.toGeoJSON().features.some(feature => {
    if (!feature.geometry) return false;

    let coords = feature.geometry.coordinates;

    if (feature.geometry.type === "Polygon") {
      coords = coords[0];
    } else if (feature.geometry.type === "MultiPolygon") {
      coords = coords[0][0]; // First polygon, first ring
    }
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
      console.error("Error checking geometry:", err);
      return false;
    }
  });

  if (!isInside) {
    const popupAlert = `
      <div style="width:250px">
          <h4>Submission out of range. Please submit your shady spot within the Toronto Regional Boundary.</h4>
      </div>
    `;
    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupAlert)
      .openOn(map);
    return;
  }

  const popupForm = `
    <div style="width:250px">
        <strong>Submit a Shady Spot</strong><br><br>
        <label>Name:<br>
          <input id="spot-name" type="text" style="width:100%">
        </label><br><br>
        <label>Description:<br>
          <textarea id="spot-desc" style="width:100%" rows="2"></textarea>
        </label><br><br>
        <label>Best time to visit:<br>
          <select id="spot-time" style="width:100%">
            <option value="">Select...</option>
            <option value="Morning">Morning</option>
            <option value="Midday">Midday</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </label><br><br>
        <button onclick="submitShadySpot(${e.latlng.lat}, ${e.latlng.lng})">Submit</button>
      </div>
    `;
  
  L.popup()
    .setLatLng(e.latlng)
    .setContent(popupForm)
    .openOn(map);
}

function submitShadySpot(lat, lng) {
  const name = document.getElementById("spot-name").value.trim();
  const desc = document.getElementById("spot-desc").value.trim();
  const time = document.getElementById("spot-time").value;

  if (!name || !desc || !time) {
    alert("Please fill out all fields.");
    return;
  }

  const marker = L.marker([lat, lng], { icon: goldIcon }).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>${lat.toFixed(5)}, ${lng.toFixed(5)}`).openPopup();

  sendToForm(lat, lng, name, desc, time);
  map.closePopup();
}  

function sendToForm(lat, lng, markerName, description, timeday) {
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
