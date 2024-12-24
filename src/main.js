// src/main.js
// src/main.js
import { initMap, updateLocation } from './map.js';
import { getVisitorInfo, updateTable } from './visitors.js';

function updateBasicInfo(visitorInfo) {
    document.getElementById('basicInfo').innerHTML = `
        <p>Host: ${visitorInfo.host}</p>
        <p>Plataforma: ${visitorInfo.platform}</p>
        <p>Idioma: ${visitorInfo.language}</p>
        <p>IP: ${visitorInfo.ip || 'No disponible'}</p>
    `;
}

function updatePageViews() {
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const pageViewsHtml = Object.entries(pageViews)
        .map(([page, count]) => `<p>${page}: ${count} visitas</p>`)
        .join('');
    document.getElementById('pageViews').innerHTML = pageViewsHtml;
}

document.addEventListener('DOMContentLoaded', async () => {
    const visitorInfo = await getVisitorInfo();
    updateBasicInfo(visitorInfo);
    initMap();
    updateLocation();
    updatePageViews();
    updateTable();
});