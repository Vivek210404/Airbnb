const axios = require("axios");
const ExpressError = require("./ExpressError");

const {configDotenv} = require("dotenv");
configDotenv();

let MAP_API =  process.env.MAP_API ;


async function getCoordinates(address) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: MAP_API,
        },
      });
  
      const result = response.data.results[0];
  
      if (!result) {
        throw new Error('No coordinates found for the given address');
      }
  
      const { lat, lng } = result.geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error('Geocoding error:', error.message);
      throw error;
    }
  }
  
  module.exports = getCoordinates;