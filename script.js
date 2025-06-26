var map = L.map('map').setView({x}/{y}/{z});

L.tileLayer('https://tile.openstreetmap.org/13/4363/-7940.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
