(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();async function i(){const t=d();return{...await c(),pageViews:t}}async function c(){const t=navigator.userAgent,e=navigator.platform,r=navigator.language,n=window.location.hostname;try{const o=await fetch("https://api.ipify.org?format=json"),{ip:a}=await o.json();return{host:n,ip:a,userAgent:t,platform:e,language:r,name:localStorage.getItem("visitorName")||"Anónimo"}}catch(o){return console.error("Error getting IP:",o),{host:n,userAgent:t,platform:e,language:r,name:localStorage.getItem("visitorName")||"Anónimo"}}}function d(){let t=JSON.parse(localStorage.getItem("pageViews")||"{}");const e=window.location.pathname;return t[e]=(t[e]||0)+1,localStorage.setItem("pageViews",JSON.stringify(t)),t}async function l(){try{const e=await(await fetch("http://localhost:3000/api/visitors")).json(),r=document.getElementById("visitorTable").getElementsByTagName("tbody")[0];r.innerHTML="",e.forEach(n=>{const o=document.createElement("tr");o.innerHTML=`
                <td>${n.host}</td>
                <td>${n.name}</td>
                <td>${n.mostVisitedPage}</td>
                <td>${n.country}</td>
                <td><pre class="small">${JSON.stringify(n.data,null,2)}</pre></td>
            `,r.appendChild(o)})}catch(t){console.error("Error updating table:",t)}}function p(t){var e;return((e=Object.entries(t).sort(([,r],[,n])=>n-r)[0])==null?void 0:e[0])||"N/A"}async function m(t){const e=await i(),r={...e,mostVisitedPage:p(e.pageViews),country:t.address.country,data:{location:t,systemInfo:e}};try{await fetch("http://localhost:3000/api/visitors",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})}catch(n){console.error("Error saving visitor data:",n)}}async function g(){"geolocation"in navigator&&navigator.geolocation.getCurrentPosition(async t=>{const{latitude:e,longitude:r}=t.coords,n=document.getElementById("map");n.innerHTML=`
                <img src="https://www.openstreetmap.org/export/embed.html?bbox=${r-.01},${e-.01},${r+.01},${e+.01}&layer=mapnik" 
                     width="100%" 
                     height="200" 
                     frameborder="0" 
                     style="border:0">
            `;const a=await(await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e}&lon=${r}&format=json`)).json();document.getElementById("locationInfo").innerHTML=`
                <p>País: ${a.address.country}</p>
                <p>Dirección: ${a.display_name}</p>
            `,m({coords:{latitude:e,longitude:r},address:a})})}function u(t){document.getElementById("basicInfo").innerHTML=`
        <p>Host: ${t.host}</p>
        <p>Plataforma: ${t.platform}</p>
        <p>Idioma: ${t.language}</p>
        <p>IP: ${t.ip||"No disponible"}</p>
    `}function f(){const t=JSON.parse(localStorage.getItem("pageViews")||"{}"),e=Object.entries(t).map(([r,n])=>`<p>${r}: ${n} visitas</p>`).join("");document.getElementById("pageViews").innerHTML=e}document.addEventListener("DOMContentLoaded",async()=>{const t=await i();u(t),g(),f(),l()});
