import axios from 'axios';

export const getTopLast30Days = async (
  token: string,
  limit: number = 10,
  page: number = 1
) => {
  try {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/leaderboard?limit=${limit}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching top last 30 days:', error);
    throw error;
  }
};

export const getTopOverall = async (token: string) => {
  try {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/leaderboard/overall`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching overall top:', error);
    throw error;
  }
};

export const getUserPosition = async (
  userId: number,
  token: string
): Promise<number> => {
  try {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/leaderboard/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.data.position;
  } catch (error) {
    console.error('Error fetching user position:', error);
    throw error;
  }
};
