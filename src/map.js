// src/map.js
import { saveVisitorData } from './visitors.js';

export function initMap() {
    // No necesitamos inicialización para mapa estático
}

export async function updateLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            
            // Crear mapa estático usando OpenStreetMap
            const mapElement = document.getElementById('map');
            mapElement.innerHTML = `
                <img src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik" 
                     width="100%" 
                     height="200" 
                     frameborder="0" 
                     style="border:0">
            `;

            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await response.json();
            
            document.getElementById('locationInfo').innerHTML = `
                <p>País: ${data.address.country}</p>
                <p>Dirección: ${data.display_name}</p>
            `;
            
            saveVisitorData({
                coords: { latitude, longitude },
                address: data
            });
        });
    }
}