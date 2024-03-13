import axios from "axios";
axios.defaults.validateStatus = (status) => status >= 200 && status <= 500;

export const login = (email: string, password: string) => {
  return axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/auth/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const register = async (email: string, password: string) => {
  return axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/auth/register`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const testAuth = async (session: string | null) => {
  if (!session) {
    throw new Error("No session");
  }

  return axios.get(`${process.env.EXPO_PUBLIC_API_URL}/v1/auth/protected`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session}`,
    },
  });
};
