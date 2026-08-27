import axios from "axios";

export const getAPOD = async () => {
  const response = await axios.get(
    "https://api.nasa.gov/planetary/apod",
    {
      params: {
        api_key: process.env.NASA_API_KEY,
      },
    }
  );

  return response.data;
};