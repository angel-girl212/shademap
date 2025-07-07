var map = L.map('map').setView([43.637869, -79.406311], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.Control.geocoder({
  defaultMarkGeocode: false
})
.on('markgeocode', e => {
  const latlng = e.geocode.center;

  map.setView(latlng, 16);

  const markerName = prompt(`You added a shady spot at ${latlng.lat.toFixed(5)} and ${latlng.lng.toFixed(5)}. What would you like to name it?`);
  
  if (markerName) {
    const description = prompt(`What makes you shady why do u like?`); // lmfao
    const marker = L.marker(latlng).addTo(map);
    marker.bindPopup(`<b>${markerName}</b><br>${latlng.toString()}`).openPopup();
  }

  if (markerName || description) {
  sendToForm({ latlng }, markerName, description);
  }
})
.addTo(map);

var marker = L.marker([43.637869, -79.406311]).addTo(map);
marker.bindPopup("<b>The Bentway</b><br>250 Fort York").openPopup();

// commented out but this should hold toronto regional boundary
// var polygon = L.polygon([
//  [43.632542, -79.422344],
//  [43.632923, -79.423289],
//  [43.632573, -79.424909],
//  [43.635376, -79.426003]
//  ]).addTo(map);

// polygon.bindPopup("<b>Toronto Regional Boundary</b><br>source: open data portal");

function add(e) {
  // var coord = e.latlng.toString().split(',');
  // var lat = coord[0].split('(');
  // var lng = coord[1].split(')');
  //alert("You added a shady spot at" + lat[1] + " and " + lng[0]);
  // const markerName = prompt(`You added a shady spot at ${lat[1]} and ${lng[0]}. What would like to name it?`);
  const markerName = prompt(`You added a shady spot at ${e.latlng.lat.toFixed(5)} and ${e.latlng.lng.toFixed(5)}. What would you like to name it?`);
  
  if (markerName) {
    const description = prompt(`What makes you shady why do u like?`); // lmfao
    const marker = L.marker(e.latlng).addTo(map);
    marker.bindPopup(`<b>${markerName}</b><br>${e.latlng.toString()}`).openPopup();
 }

  if (markerName || description) {
  sendToForm(e, markerName, description);
 }
}

function sendToForm(e, markerName, description) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  // const timeStamp = new Date().toISOString();
  // const userId = "user-" + Math.floor(Math.random() * 100000);

  const formUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfNV5ldiWUsR3nYRD35-_m2W4TSuUuijP3L55uOLdtPwqC2AQ/formResponse";
  const formData = new URLSearchParams();
  formData.append("entry.901935268", lat);     
  formData.append("entry.1956546171", lng);
  formData.append("entry.1519028228", markerName);
  formData.append("entry.772410688", description);
  // formData.append("entry.56758637", timeStamp);  // timestamp optional field
  // formData.append("entry.1570862743", userId); // userId

  fetch(formUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).catch(err => console.error("Error:", err));
}

map.addEventListener('click', add); // not gonna pretend i undrstand that
