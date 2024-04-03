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

export const searchPlaces = async (
  token: string,
  limit: number = 10,
  page: number = 1,
  latitude: number,
  longitude: number,
  query: string = "",
  region: string = "",
  type: string = ""
) => {
  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places?limit=${limit}&page=${page}&latitude=${latitude}&longitude=${longitude}&query=${query}&region=${region}&type=${type}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const visitPlace = async (
  token: string,
  code: string,
  latitude: number,
  longitude: number
) => {
  const res = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places/visits`,
    {
      qrData: code,
      latitude,
      longitude,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

export const hasVisitedPlace = async (
  token: string,
  userId: number,
  placeId: number
) => {
  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places/visits/${userId}?placeId=${placeId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};
