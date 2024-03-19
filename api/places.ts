export const fetchPage = async (slug: string, token: string) => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/places/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
