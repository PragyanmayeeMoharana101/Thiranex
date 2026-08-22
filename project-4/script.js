/**
 * ==============================================================================
 * Project: Thiranex Real-Time Weather Dashboard
 * Topic: Asynchronous JavaScript & RESTful APIs
 * Description: Fetches live global weather using Fetch API, async/await, and Open-Meteo REST API.
 * ==============================================================================
 */

// ==========================================
// 1. Application State & Global References
// ==========================================
const AppState = {
    currentUnit: 'celsius', // 'celsius' or 'fahrenheit'
    lastLocationData: null,
    lastWeatherData: null,
    lastSearchedCity: ''
};

// DOM Element Selectors
const Elements = {
    // Search Form & Inputs
    searchForm: document.getElementById('searchForm'),
    cityInput: document.getElementById('cityInput'),
    clearBtn: document.getElementById('clearBtn'),
    searchBtn: document.getElementById('searchBtn'),
    quickChips: document.querySelectorAll('.city-chip'),

    // Temperature Unit Toggles
    unitCelsius: document.getElementById('unitCelsius'),
    unitFahrenheit: document.getElementById('unitFahrenheit'),

    // State Containers
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorCard: document.getElementById('errorCard'),
    errorMessage: document.getElementById('errorMessage'),
    dismissErrorBtn: document.getElementById('dismissErrorBtn'),
    welcomeCard: document.getElementById('welcomeCard'),
    weatherDisplay: document.getElementById('weatherDisplay'),

    // Weather Hero Card Elements
    cityName: document.getElementById('cityName'),
    countryName: document.getElementById('countryName'),
    adminRegion: document.getElementById('adminRegion'),
    localDate: document.getElementById('localDate'),
    localTime: document.getElementById('localTime'),
    weatherIconContainer: document.getElementById('weatherIconContainer'),
    mainTemperature: document.getElementById('mainTemperature'),
    activeTempUnit: document.getElementById('activeTempUnit'),
    weatherCondition: document.getElementById('weatherCondition'),
    feelsLikeTemp: document.getElementById('feelsLikeTemp'),

    // Detailed Metrics Elements
    humidityValue: document.getElementById('humidityValue'),
    humidityStatus: document.getElementById('humidityStatus'),
    windSpeedValue: document.getElementById('windSpeedValue'),
    windDirectionStatus: document.getElementById('windDirectionStatus'),
    pressureValue: document.getElementById('pressureValue'),
    pressureStatus: document.getElementById('pressureStatus'),
    maxTempValue: document.getElementById('maxTempValue'),
    minTempValue: document.getElementById('minTempValue'),
    dayPhaseText: document.getElementById('dayPhaseText'),
    dayPhaseStatus: document.getElementById('dayPhaseStatus'),
    latCoords: document.getElementById('latCoords'),
    lonCoords: document.getElementById('lonCoords'),
    timezoneBadge: document.getElementById('timezoneBadge'),

    // Footer & Action Elements
    lastUpdatedTime: document.getElementById('lastUpdatedTime'),
    refreshBtn: document.getElementById('refreshBtn')
};

// ==========================================
// 2. Weather Code Mapping (WMO Standards)
// ==========================================
/**
 * Maps WMO numerical weather codes to human-readable text, emojis, and visual themes.
 * @param {number} code - WMO weather code (0 - 99)
 * @param {number} isDay - 1 for daytime, 0 for night
 * @returns {Object} { description: string, emoji: string, theme: string }
 */
function getWeatherDescription(code, isDay = 1) {
    const isDaytime = Number(isDay) === 1;

    switch (code) {
        case 0:
            return {
                description: 'Clear Sky',
                emoji: isDaytime ? '☀️' : '🌙',
                theme: isDaytime ? 'theme-clear-day' : 'theme-clear-night'
            };
        case 1:
            return {
                description: 'Mainly Clear',
                emoji: isDaytime ? '🌤️' : '🌤️',
                theme: isDaytime ? 'theme-clear-day' : 'theme-clear-night'
            };
        case 2:
            return {
                description: 'Partly Cloudy',
                emoji: '⛅',
                theme: 'theme-cloudy'
            };
        case 3:
            return {
                description: 'Overcast',
                emoji: '☁️',
                theme: 'theme-cloudy'
            };
        case 45:
            return {
                description: 'Foggy',
                emoji: '🌫️',
                theme: 'theme-cloudy'
            };
        case 48:
            return {
                description: 'Depositing Rime Fog',
                emoji: '🌫️',
                theme: 'theme-cloudy'
            };
        case 51:
            return {
                description: 'Light Drizzle',
                emoji: '🌦️',
                theme: 'theme-rainy'
            };
        case 53:
            return {
                description: 'Moderate Drizzle',
                emoji: '🌧️',
                theme: 'theme-rainy'
            };
        case 55:
            return {
                description: 'Dense Drizzle',
                emoji: '🌧️',
                theme: 'theme-rainy'
            };
        case 56:
        case 57:
            return {
                description: 'Freezing Drizzle',
                emoji: '🌨️',
                theme: 'theme-snowy'
            };
        case 61:
            return {
                description: 'Slight Rain',
                emoji: '🌦️',
                theme: 'theme-rainy'
            };
        case 63:
            return {
                description: 'Moderate Rain',
                emoji: '🌧️',
                theme: 'theme-rainy'
            };
        case 65:
            return {
                description: 'Heavy Rain',
                emoji: '🌧️',
                theme: 'theme-rainy'
            };
        case 66:
        case 67:
            return {
                description: 'Freezing Rain',
                emoji: '🌨️',
                theme: 'theme-snowy'
            };
        case 71:
            return {
                description: 'Slight Snow Fall',
                emoji: '🌨️',
                theme: 'theme-snowy'
            };
        case 73:
            return {
                description: 'Moderate Snow Fall',
                emoji: '❄️',
                theme: 'theme-snowy'
            };
        case 75:
            return {
                description: 'Heavy Snow Fall',
                emoji: '❄️',
                theme: 'theme-snowy'
            };
        case 77:
            return {
                description: 'Snow Grains',
                emoji: '❄️',
                theme: 'theme-snowy'
            };
        case 80:
            return {
                description: 'Slight Rain Showers',
                emoji: '🌦️',
                theme: 'theme-rainy'
            };
        case 81:
            return {
                description: 'Moderate Rain Showers',
                emoji: '🌧️',
                theme: 'theme-rainy'
            };
        case 82:
            return {
                description: 'Violent Rain Showers',
                emoji: '⛈️',
                theme: 'theme-rainy'
            };
        case 85:
        case 86:
            return {
                description: 'Snow Showers',
                emoji: '🌨️',
                theme: 'theme-snowy'
            };
        case 95:
            return {
                description: 'Thunderstorm',
                emoji: '⛈️',
                theme: 'theme-thunderstorm'
            };
        case 96:
        case 99:
            return {
                description: 'Thunderstorm with Hail',
                emoji: '⛈️',
                theme: 'theme-thunderstorm'
            };
        default:
            return {
                description: 'Unknown Weather Condition',
                emoji: '🌡️',
                theme: 'theme-default'
            };
    }
}

// ==========================================
// 3. UI State Helpers (Loading / Error / Themes)
// ==========================================
/**
 * Shows the loading spinner and hides active weather/welcome/error cards.
 */
function showLoading() {
    Elements.loadingIndicator.classList.remove('hidden');
    Elements.errorCard.classList.add('hidden');
    Elements.welcomeCard.classList.add('hidden');
    Elements.weatherDisplay.classList.add('hidden');
    Elements.searchBtn.disabled = true;
    Elements.searchBtn.style.opacity = '0.7';
}

/**
 * Hides the loading spinner and re-enables the search button.
 */
function hideLoading() {
    Elements.loadingIndicator.classList.add('hidden');
    Elements.searchBtn.disabled = false;
    Elements.searchBtn.style.opacity = '1';
}

/**
 * Displays a friendly error message on the error card.
 * @param {string} message - User-friendly error explanation
 */
function displayError(message) {
    hideLoading();
    Elements.errorMessage.textContent = message;
    Elements.errorCard.classList.remove('hidden');
    Elements.weatherDisplay.classList.add('hidden');
    Elements.welcomeCard.classList.add('hidden');
    document.body.className = 'theme-default';
}

/**
 * Applies weather-specific theme styling to the background body.
 * @param {string} themeClass 
 */
function applyTheme(themeClass) {
    document.body.className = themeClass || 'theme-default';
}

// ==========================================
// 4. Data Conversion Utilities
// ==========================================
/**
 * Converts Celsius to Fahrenheit if unit is set to fahrenheit.
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Formatted temperature
 */
function formatTemperature(celsius) {
    if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
    if (AppState.currentUnit === 'fahrenheit') {
        const fahrenheit = (celsius * 9 / 5) + 32;
        return Math.round(fahrenheit);
    }
    return Math.round(celsius);
}

/**
 * Converts wind direction angle (0-360°) to cardinal directions.
 * @param {number} degrees 
 * @returns {string} e.g., "North-East (NE)"
 */
function getWindDirection(degrees) {
    if (degrees === null || degrees === undefined || isNaN(degrees)) return 'N/A';
    const directions = [
        { name: 'North', abbr: 'N' },
        { name: 'North-East', abbr: 'NE' },
        { name: 'East', abbr: 'E' },
        { name: 'South-East', abbr: 'SE' },
        { name: 'South', abbr: 'S' },
        { name: 'South-West', abbr: 'SW' },
        { name: 'West', abbr: 'W' },
        { name: 'North-West', abbr: 'NW' }
    ];
    const index = Math.round(degrees / 45) % 8;
    return `${directions[index].name} (${directions[index].abbr})`;
}

/**
 * Categorizes humidity into qualitative descriptions.
 * @param {number} humidity 
 * @returns {string} e.g., "Comfortable", "Humid", "Dry"
 */
function getHumidityStatus(humidity) {
    if (humidity < 30) return 'Dry Air (Low)';
    if (humidity <= 60) return 'Comfortable (Optimal)';
    if (humidity <= 80) return 'Humid (High)';
    return 'Very Humid';
}

/**
 * Categorizes atmospheric pressure.
 * @param {number} pressure in hPa
 * @returns {string}
 */
function getPressureStatus(pressure) {
    if (pressure < 1000) return 'Low Pressure (Storm Risk)';
    if (pressure <= 1020) return 'Normal Pressure';
    return 'High Pressure (Stable)';
}

/**
 * Formats a local date and time string from ISO timestamp and timezone.
 * @param {string} isoString 
 * @param {string} timezone 
 * @returns {Object} { dateStr, timeStr }
 */
function formatLocalTime(isoString, timezone) {
    try {
        const date = isoString ? new Date(isoString) : new Date();
        const dateOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timeZone: timezone || undefined
        };
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: timezone || undefined
        };

        return {
            dateStr: new Intl.DateTimeFormat('en-US', dateOptions).format(date),
            timeStr: new Intl.DateTimeFormat('en-US', timeOptions).format(date)
        };
    } catch {
        const now = new Date();
        return {
            dateStr: now.toDateString(),
            timeStr: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }
}

// ==========================================
// 5. REST API Services (Fetch & async/await)
// ==========================================
/**
 * Step 1: Fetches latitude, longitude, and country metadata for a city name via Open-Meteo Geocoding API.
 * @param {string} city - User-entered city name
 * @returns {Promise<Object>} Location metadata { name, country, admin1, latitude, longitude, timezone }
 */
async function getCoordinates(city) {
    const encodedCity = encodeURIComponent(city.trim());
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=en&format=json`;

    const response = await fetch(geocodingUrl);

    // Check HTTP status code
    if (!response.ok) {
        throw new Error(`Geocoding service error (HTTP ${response.status})`);
    }

    const data = await response.json();

    // Verify if results array exists and contains matches
    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" not found. Please check spelling and try again.`);
    }

    const result = data.results[0];
    return {
        name: result.name,
        country: result.country || 'Unknown Country',
        admin1: result.admin1 || '',
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone || 'UTC'
    };
}

/**
 * Step 2: Fetches live weather metrics using latitude & longitude from Open-Meteo Forecast API.
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Open-Meteo Forecast JSON payload
 */
async function getWeather(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(weatherUrl);

    // Check HTTP status code
    if (!response.ok) {
        throw new Error(`Weather service error (HTTP ${response.status})`);
    }

    const weatherData = await response.json();

    if (!weatherData.current) {
        throw new Error('Incomplete weather data received from server.');
    }

    return weatherData;
}

// ==========================================
// 6. UI Rendering & DOM Manipulation
// ==========================================
/**
 * Renders the fetched location and weather data onto the DOM.
 * @param {Object} locationData 
 * @param {Object} weatherData 
 */
function displayWeather(locationData, weatherData) {
    const current = weatherData.current;
    const daily = weatherData.daily;
    const isDay = current.is_day ?? 1;
    const weatherInfo = getWeatherDescription(current.weather_code, isDay);

    // 1. Update Theme
    applyTheme(weatherInfo.theme);

    // 2. Populate Location & Date/Time
    Elements.cityName.textContent = locationData.name;
    Elements.countryName.textContent = locationData.country;
    Elements.adminRegion.textContent = locationData.admin1 ? `${locationData.admin1}, ${locationData.country}` : locationData.country;

    const formattedTime = formatLocalTime(current.time, weatherData.timezone);
    Elements.localDate.textContent = formattedTime.dateStr;
    Elements.localTime.textContent = formattedTime.timeStr;

    // 3. Populate Hero Weather Card
    const currentTemp = formatTemperature(current.temperature_2m);
    const feelsLike = formatTemperature(current.apparent_temperature);
    const tempSymbol = AppState.currentUnit === 'celsius' ? '°C' : '°F';

    Elements.mainTemperature.textContent = currentTemp;
    Elements.activeTempUnit.textContent = tempSymbol;
    Elements.weatherIconContainer.textContent = weatherInfo.emoji;
    Elements.weatherCondition.textContent = weatherInfo.description;
    Elements.feelsLikeTemp.textContent = `${feelsLike}${tempSymbol}`;

    // 4. Populate Detailed Metrics Grid
    // Humidity
    Elements.humidityValue.textContent = current.relative_humidity_2m ?? '--';
    Elements.humidityStatus.textContent = getHumidityStatus(current.relative_humidity_2m);

    // Wind Speed & Direction
    Elements.windSpeedValue.textContent = current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m * 10) / 10 : '--';
    Elements.windDirectionStatus.textContent = getWindDirection(current.wind_direction_10m);

    // Atmospheric Pressure
    Elements.pressureValue.textContent = current.surface_pressure !== undefined ? Math.round(current.surface_pressure * 10) / 10 : '--';
    Elements.pressureStatus.textContent = getPressureStatus(current.surface_pressure);

    // Daily Min/Max Temperatures
    if (daily && daily.temperature_2m_max && daily.temperature_2m_min) {
        const maxTemp = formatTemperature(daily.temperature_2m_max[0]);
        const minTemp = formatTemperature(daily.temperature_2m_min[0]);
        Elements.maxTempValue.textContent = `${maxTemp}${tempSymbol}`;
        Elements.minTempValue.textContent = `${minTemp}${tempSymbol}`;
    } else {
        Elements.maxTempValue.textContent = '--';
        Elements.minTempValue.textContent = '--';
    }

    // Daylight / Solar Phase
    Elements.dayPhaseText.textContent = isDay === 1 ? 'Daytime' : 'Night Time';
    Elements.dayPhaseStatus.textContent = isDay === 1 ? 'Solar Daylight' : 'Nocturnal Phase';

    // Coordinates & Timezone
    const latFormatted = `${Math.abs(locationData.latitude).toFixed(2)}° ${locationData.latitude >= 0 ? 'N' : 'S'}`;
    const lonFormatted = `${Math.abs(locationData.longitude).toFixed(2)}° ${locationData.longitude >= 0 ? 'E' : 'W'}`;
    Elements.latCoords.textContent = `Lat: ${latFormatted}`;
    Elements.lonCoords.textContent = `Lon: ${lonFormatted}`;
    Elements.timezoneBadge.textContent = weatherData.timezone || locationData.timezone || 'UTC';

    // 5. Last Updated Timestamp
    const now = new Date();
    Elements.lastUpdatedTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 6. Reveal Weather Display Container
    Elements.welcomeCard.classList.add('hidden');
    Elements.errorCard.classList.add('hidden');
    Elements.weatherDisplay.classList.remove('hidden');
}

// ==========================================
// 7. Core Workflow Orchestrator
// ==========================================
/**
 * Coordinates user input validation, coordinate resolution, and weather data retrieval.
 * @param {string} cityName - Target city name
 */
async function searchWeather(cityName) {
    const trimmedCity = cityName ? cityName.trim() : '';

    // Input Validation
    if (!trimmedCity) {
        displayError('Please enter a city name to search for weather.');
        Elements.cityInput.focus();
        return;
    }

    showLoading();

    try {
        // Step 1: Convert City Name to Geographical Coordinates
        const locationData = await getCoordinates(trimmedCity);

        // Step 2: Fetch Current & Forecast Weather Data
        const weatherData = await getWeather(locationData.latitude, locationData.longitude);

        // Step 3: Cache active state
        AppState.lastLocationData = locationData;
        AppState.lastWeatherData = weatherData;
        AppState.lastSearchedCity = trimmedCity;

        // Step 4: Display Data on UI
        displayWeather(locationData, weatherData);

    } catch (error) {
        console.error('Weather retrieval error:', error);

        // Friendly Error Message Handling
        if (!navigator.onLine) {
            displayError('Network error. Please check your internet connection and try again.');
        } else if (error.message && error.message.includes('Failed to fetch')) {
            displayError('Unable to connect to the weather service. Please check your connection.');
        } else {
            displayError(error.message || 'An unexpected error occurred while fetching weather data.');
        }
    } finally {
        hideLoading();
    }
}

// ==========================================
// 8. Event Listeners & Initialization
// ==========================================
function setupEventListeners() {
    // Search form submission (handles Search button click & Enter key)
    Elements.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchWeather(Elements.cityInput.value);
    });

    // Input clear button toggle
    Elements.cityInput.addEventListener('input', () => {
        if (Elements.cityInput.value.trim().length > 0) {
            Elements.clearBtn.classList.remove('hidden');
        } else {
            Elements.clearBtn.classList.add('hidden');
        }
    });

    // Clear button action
    Elements.clearBtn.addEventListener('click', () => {
        Elements.cityInput.value = '';
        Elements.clearBtn.classList.add('hidden');
        Elements.cityInput.focus();
    });

    // Quick City Chips
    Elements.quickChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const city = chip.getAttribute('data-city');
            if (city) {
                Elements.cityInput.value = city;
                Elements.clearBtn.classList.remove('hidden');
                searchWeather(city);
            }
        });
    });

    // Error Card Dismiss
    Elements.dismissErrorBtn.addEventListener('click', () => {
        Elements.errorCard.classList.add('hidden');
        if (!AppState.lastLocationData) {
            Elements.welcomeCard.classList.remove('hidden');
        } else {
            Elements.weatherDisplay.classList.remove('hidden');
        }
    });

    // Refresh Current City Button
    Elements.refreshBtn.addEventListener('click', () => {
        if (AppState.lastSearchedCity) {
            searchWeather(AppState.lastSearchedCity);
        } else if (Elements.cityInput.value.trim()) {
            searchWeather(Elements.cityInput.value.trim());
        }
    });

    // Temperature Unit Toggles
    Elements.unitCelsius.addEventListener('click', () => {
        if (AppState.currentUnit !== 'celsius') {
            AppState.currentUnit = 'celsius';
            Elements.unitCelsius.classList.add('active');
            Elements.unitCelsius.setAttribute('aria-pressed', 'true');
            Elements.unitFahrenheit.classList.remove('active');
            Elements.unitFahrenheit.setAttribute('aria-pressed', 'false');

            if (AppState.lastLocationData && AppState.lastWeatherData) {
                displayWeather(AppState.lastLocationData, AppState.lastWeatherData);
            }
        }
    });

    Elements.unitFahrenheit.addEventListener('click', () => {
        if (AppState.currentUnit !== 'fahrenheit') {
            AppState.currentUnit = 'fahrenheit';
            Elements.unitFahrenheit.classList.add('active');
            Elements.unitFahrenheit.setAttribute('aria-pressed', 'true');
            Elements.unitCelsius.classList.remove('active');
            Elements.unitCelsius.setAttribute('aria-pressed', 'false');

            if (AppState.lastLocationData && AppState.lastWeatherData) {
                displayWeather(AppState.lastLocationData, AppState.lastWeatherData);
            }
        }
    });
}

/**
 * Initialize Dashboard Application on page load
 */
function init() {
    setupEventListeners();
    // Default initial city to showcase dashboard immediately on load
    searchWeather('London');
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
