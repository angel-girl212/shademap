var map = L.map('map').setView([44.09, 27.41], 13);

L.tileLayer('https://tile.openstreetmap.org/13/4409/2741.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
