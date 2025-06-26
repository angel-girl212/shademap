var map = L.map('map').setView([43.637869, -79.406311], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([43.637869, -79.406311]).addTo(map);
marker.bindPopup("<b>The Bentway</b><br>250 Fort York").openPopup();

var polygon = L.polygon([
  [43.635376, -79.426003],
  [43.638746, -79.410735],
  [43.639352, -79.410982],
  [43.639996, -79.410338],
  [43.641138, -79.409781],
  [43.643739, -79.410725],
  [43.643933, -79.409759],
  [43.642667, -79.408697],
  [43.641666, -79.407302],
  [43.641852, -79.406294],
  [43.641518, -79.405382],
  [43.641332, -79.404513],
  [43.640641, -79.404234],
  [43.641176, -79.401627],
  [43.640695, -79.401439],
  [43.642722, -79.393827],
  [43.643917, -79.388613],
  [43.645221, -79.382454],
  [43.645912, -79.378967],
  [43.645843, -79.376564],
  [43.643739, -79.375619],
  [43.641976, -79.374632],
  [43.640105, -79.373237],
  [43.637807, -79.379364],
  [43.637504, -79.382819],
  [43.63717,  -79.387025],
  [43.636324, -79.391885],
  [43.635275, -79.394417],
  [43.632379, -79.39976],
  [43.635648, -79.403107],
  [43.635943, -79.404352],
  [43.636192, -79.405543],
  [43.636285, -79.406701],
  [43.636262, -79.408107],
  [43.635951, -79.409695],
  [43.633124, -79.421958],
  [43.632542, -79.422344],
  [43.632923, -79.423289],
  [43.632573, -79.424909],
  [43.635376, -79.426003]
  ]).addTo(map);

polygon.bindPopup("<b>Under Gardiner Public Realm Plan</b><br>study area");

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on('click', onMapClick);

function ask() {
  var answer = window.confirm("Would you like to input this location as a shady spot?");
    if (answer) {
      // send to webapp
    } else {
      // close window
    }
}

map.addEventListener("dblclick", () => {
  ask();
});
