import axios from "axios";

export const getPlaceById = async (slug: string, token: string) => {
  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places/${slug}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const getNearPlaces = async (
  token: string,
  latitude: number,
  longitude: number,
  limit: number = 10,
  page: number = 1
) => {
  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places?limit=${limit}&page=${page}&latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const getTrendingPlaces = async (token: string) => {
  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places/trending`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};
