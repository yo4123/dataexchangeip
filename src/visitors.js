// src/visitors.js
export async function getVisitorInfo() {
    const pageViews = getPageViews();
    const systemInfo = await getSystemInfo();
    return {
        ...systemInfo,
        pageViews
    };
}

async function getSystemInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const hostname = window.location.hostname;
    
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const { ip } = await response.json();
        return {
            host: hostname,
            ip,
            userAgent,
            platform,
            language,
            name: localStorage.getItem('visitorName') || 'Anónimo'
        };
    } catch (error) {
        console.error('Error getting IP:', error);
        return {
            host: hostname,
            userAgent,
            platform,
            language,
            name: localStorage.getItem('visitorName') || 'Anónimo'
        };
    }
}

function getPageViews() {
    let pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
    const currentPath = window.location.pathname;
    
    pageViews[currentPath] = (pageViews[currentPath] || 0) + 1;
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
    
    return pageViews;
}

export async function updateTable() {
    try {
        const response = await fetch('http://localhost:3000/api/visitors');
        const visitors = await response.json();
        
        const tbody = document.getElementById('visitorTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        
        visitors.forEach(visitor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${visitor.host}</td>
                <td>${visitor.name}</td>
                <td>${visitor.mostVisitedPage}</td>
                <td>${visitor.country}</td>
                <td><pre class="small">${JSON.stringify(visitor.data, null, 2)}</pre></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error updating table:', error);
    }
}

function getMostVisitedPage(pageViews) {
    return Object.entries(pageViews)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
}

export async function saveVisitorData(locationData) {
    const visitorInfo = await getVisitorInfo();
    const data = {
        ...visitorInfo,
        mostVisitedPage: getMostVisitedPage(visitorInfo.pageViews),
        country: locationData.address.country,
        data: {
            location: locationData,
            systemInfo: visitorInfo
        }
    };
    
    try {
        await fetch('http://localhost:3000/api/visitors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving visitor data:', error);
    }
}