import React, { useEffect, useState } from "react";
import axios from "axios";
import './weather.css'; // Import CSS file for styling

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Use the browser's Geolocation API to get the user's coordinates
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Use OpenCage Geocoding API to get location details based on coordinates
        const { data } = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?key=35f694f474c04af18f23ee0edd5724d3&q=${position.coords.latitude}+${position.coords.longitude}&language=en&pretty=1`
        );

        // Get the city name from the OpenCage response
        const cityName = data.results[0].components.city;

        // Use OpenWeatherMap API to get current weather based on the city name
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=dd7121dd2883396ee0395b4e0d85a1a5`
        );

        setWeatherData(weatherResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    getUserLocation();
  }, []);

  if (loading) {
    return <div className="loading">Loading weather data...</div>;
  }

  if (!weatherData) {
    return <div className="error">Unable to fetch weather data.</div>;
  }

  // Convert temperature from Kelvin to Fahrenheit
  const temperatureFahrenheit = Math.round((weatherData.main.temp - 273.15) * 9/5 + 32);

  // Add your logic to suggest outfits based on the weather data
  const suggestOutfit = () => {
    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    let outfitSuggestion = "";

    if (weatherCondition === "clear") {
      if (temperatureFahrenheit > 77) {
        outfitSuggestion = (
          <div>
            <p>It's hot and sunny. Wear shorts, a t-shirt, and sunglasses.</p>
            <p>Don't forget sunscreen and a hat to protect yourself from the sun.</p>
          </div>
        );
      } else if (temperatureFahrenheit > 59) {
        outfitSuggestion = "It's warm and sunny. Wear light clothing and sunscreen.";
      } else {
        outfitSuggestion = "It's sunny but cooler. Consider wearing a light jacket.";
      }
    } else if (weatherCondition === "clouds") {
      if (temperatureFahrenheit > 68) {
        outfitSuggestion = "It's cloudy but warm. Wear a light jacket or sweater.";
      } else {
        outfitSuggestion = "It's cloudy and cooler. Consider wearing layers.";
      }
    } else if (weatherCondition === "rain") {
      if (temperatureFahrenheit > 50) {
        outfitSuggestion = "It's raining. Don't forget your umbrella and waterproof jacket.";
      } else {
        outfitSuggestion = "It's raining and cold. Wear a raincoat, boots, and carry an umbrella.";
      }
    } else if (weatherCondition === "snow") {
      outfitSuggestion = "It's snowing. Dress warmly with layers, a coat, and boots.";
    } else if (weatherCondition === "thunderstorm") {
      outfitSuggestion = "It's a thunderstorm. Stay indoors and avoid going outside.";
    } else if (weatherCondition === "mist" || weatherCondition === "haze") {
      outfitSuggestion = "It's misty or hazy. Dress comfortably and be cautious while traveling.";
    } else {
      outfitSuggestion = "Weather conditions are uncertain. Dress appropriately.";
    }

    return outfitSuggestion;
  };

  return (
    <div className="weather-container">
      <div className="weather-details">
        <h2 className="title">Weather Information</h2>
        <p>City: {weatherData.name}</p>
        <p>Temperature: {temperatureFahrenheit} °F</p>
        <p>Weather: {weatherData.weather[0].main}</p>
      </div>
      <div className="outfit-suggestion-box">
        <h2 className="outfit-title">Outfit Suggestion</h2>
        <div className="outfit-suggestion">{suggestOutfit()}</div>
      </div>
    </div>
  );
};

export default Weather;
