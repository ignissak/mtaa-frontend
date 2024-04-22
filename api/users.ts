import axios from 'axios';
import { appState$ } from '../tools/state';

export const updateSettings = async (token: string) => {
  return await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/users/settings`,
    {
      appearance: appState$.localSettings.appearance.get(),
      language: appState$.localSettings.language.get(),
      visitedPublic: appState$.localSettings.visitedPublic.get(),
      name: appState$.localSettings.name.get() || "",
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getUserReviews = async (token: string, userId: number, placeId?: number) => {
  try {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/users/${userId}/reviews?placeId=${placeId || ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

export const deleteReviewById = async (token: string, reviewId: number) => {
  try {
    const res = await axios.delete(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/users/reviews/${reviewId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Review deleted:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
