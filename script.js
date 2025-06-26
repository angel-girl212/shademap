var map = L.map('map').setView([43.63, -79.40], 13);

L.tileLayer('https://tile.openstreetmap.org/13/4363/-7940.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
