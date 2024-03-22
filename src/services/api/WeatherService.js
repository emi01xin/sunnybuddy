import axios from 'axios';

const API_KEY = '1db8940dbc2304f182bb32336f05e5c4';
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: API_KEY,
        units: 'metric', // 'imperial' for Fahrenheit
        exclude: 'minutely,hourly', // exclude minute-by-minute and hourly data 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export default {
  fetchWeatherData,
};
