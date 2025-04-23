

const apiKey = '0d68b539392ff62e42695ebc624bb7c1';

    async function fetchWeather(city) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        if (data.cod !== 200) return alert('City not found');
        updateWeatherDisplay(data);
        fetchForecast(data.coord.lat, data.coord.lon);
      } catch (error) {
        console.error(error);
        alert('Error fetching weather');
      }
    }

    function showLocalTime(data) {
      const offset = data.timezone;
      const city = data.name;
      const country = data.sys.country;
  
      const nowUTC = new Date();
      const utcTime = nowUTC.getTime() + nowUTC.getTimezoneOffset() * 60000;
      const localTime = new Date(utcTime + offset * 1000);
  
      const formattedTime = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
  
      const formattedDate = localTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      const dateTimeElement = document.getElementById('localDateTime');
      if (dateTimeElement) {
        if (city.toLowerCase() === country.toLowerCase()) {
          dateTimeElement.textContent = `Time in ${country}: ${formattedDate} at ${formattedTime}`;
        } else {
          dateTimeElement.textContent = `Time in ${city}, ${country}: ${formattedDate} at ${formattedTime}`;
        }
      }
    }
    async function fetchForecast(lat, lon) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '';
        const dailyData = data.list.filter((_, i) => i % 8 === 0);

        dailyData.forEach(day => {
          const date = new Date(day.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

          const card = document.createElement('div');
          card.className = 'bg-white bg-opacity-25 backdrop-blur-xl rounded-xl p-4 text-center shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300';
          card.innerHTML = `
            <h3 class="text-lg font-bold mb-2 text-white drop-shadow-sm">${dayName}</h3>
            <img class="mx-auto w-14 h-14" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Icon">
            <p class="text-base font-medium mt-2 text-yellow-200">${Math.ceil(day.main.temp)} °C</p>
          `;
          forecastDiv.appendChild(card);
        });
      } catch (error) {
        console.error(error);
      }
    }

    function updateWeatherDisplay(data) {
      document.getElementById('cityName').textContent = data.name;
      document.getElementById('temperature').textContent = `Temperature: ${Math.ceil(data.main.temp)} °C`;
      document.getElementById('condition').textContent = `Condition: ${data.weather[0].description}`;
      document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      changeBackground(data.weather[0].main);
      showLocalTime(data); // 👈 Local time added here
    }

    function changeBackground(condition) {
      const bgQuery = {
        clear: 'clear',
        clouds: 'clouds',
        rain: 'rain',
        drizzle: 'drizzle',
        snow: 'snow',
        thunderstorm: 'thunderstorm',
        haze: 'haze',
        default: 'default'
      };

      const query = bgQuery[condition.toLowerCase()] || bgQuery.default;

      const weatherImages = {
        clear: [
          "assets/clear/istockphoto-1328689113-1024x1024.jpg",
          "assets/clear/istockphoto-2080092155-1024x1024.jpg"   
        ],
        clouds: [
          "assets/clouds/sky-6804245_1280.jpg",
          "assets/clouds/volcano-3779159_1280.jpg"
        ],
        rain: [
          "assets/rainy/spring-7167212_1280.jpg",
          "assets/rainy/spring-7167212_1280.jpg"
        ],
        drizzle: [
          "https://cdn.pixabay.com/photo/2020/03/21/17/36/girl-4952799_1280.jpg",
          "https://cdn.pixabay.com/photo/2015/09/18/19/03/rain-944778_1280.jpg"
        ],
        snow: [
          "assets/snow/snow-7646952_1280.jpg",
          "assets/snow/koryaksky-volcano-2790656_1280.jpg"
        ],
        thunderstorm: [
          "assets/storm/beach-8463642_1280.webp",
          "assets/storm/city-8482107_1280.jpg"
        ],
        haze: [
          "assets/haze/fog-7750811_1280.jpg",
          "assets/haze/sky-1373167_1280.jpg"
        ],
        default: [
          "OIP.jpg"
        ]
      };

      const images = weatherImages[query];
      const randomImage = images[Math.floor(Math.random() * images.length)];

      document.body.style.backgroundImage = `
        linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(180,180,180,0.1)),
        url('${randomImage}')
      `;
    }


    document.getElementById('searchInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') fetchWeather(e.target.value);
    });

    navigator.geolocation?.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather('Lahore')
    );

    async function fetchWeatherByCoords(lat, lon) {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        updateWeatherDisplay(data);
        fetchForecast(lat, lon);
      } catch (error) {
        console.error(error);
      }
    }



