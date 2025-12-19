// Fonction pour obtenir les coordonnées d'une ville via Nominatim (OpenStreetMap)
async function getCityCoordinates(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`;
    
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'MeteoApp/1.0'
        }
    });
    
    if (!response.ok) {
        throw new Error('Impossible de trouver la ville');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
        throw new Error('Ville non trouvée');
    }
    
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
    };
}

// Fonction pour obtenir la météo via Open-Meteo
async function getWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données météo');
    }
    
    return await response.json();
}

// Fonction principale pour afficher la météo
async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const weatherDisplay = document.getElementById('weatherDisplay');
    
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showError('Veuillez entrer un nom de ville');
        return;
    }
    
    // Réinitialiser l'affichage
    loading.classList.add('show');
    error.classList.remove('show');
    weatherDisplay.classList.remove('show');
    
    try {
        // Étape 1: Obtenir les coordonnées
        const coords = await getCityCoordinates(cityName);
        
        // Étape 2: Obtenir la météo
        const weather = await getWeatherData(coords.lat, coords.lon);
        
        // Étape 3: Afficher les résultats
        displayWeather(coords.displayName, weather);
        
    } catch (err) {
        showError(err.message);
    } finally {
        loading.classList.remove('show');
    }
}

// Fonction pour afficher les données météo
function displayWeather(cityName, weather) {
    const current = weather.current;
    
    document.getElementById('cityName').textContent = cityName.split(',')[0];
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('pressure').textContent = `${current.surface_pressure} hPa`;
    document.getElementById('precipitation').textContent = `${current.precipitation} mm`;
    
    document.getElementById('weatherDisplay').classList.add('show');
}

// Fonction pour afficher les erreurs
function showError(message) {
    const error = document.getElementById('error');
    error.textContent = `❌ ${message}`;
    error.classList.add('show');
}

// Permettre la recherche avec la touche Entrée
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Charger Paris au démarrage
window.addEventListener('load', function() {
    getWeather();
});