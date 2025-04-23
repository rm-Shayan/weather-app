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