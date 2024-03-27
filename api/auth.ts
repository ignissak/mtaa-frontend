import axios from "axios";
import { appState$ } from "../tools/state";

export const login = async (email: string, password: string) => {
  const res = await axios.post(
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
  const status = res.status;
  if (status === 200) {
    appState$.user.set({
      token: res.data.data.access_token,
      userId: res.data.data.userId,
    });
    return res;
  }
  return res;
};

export const register = async (email: string, password: string) => {
  const res = await axios.post(
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
  const status = res.status;
  if (status === 201) {
    appState$.user.token.set(res.data.token);
    appState$.user.userId.set(res.data.userId);
    return res;
  }
  return res;
};

export const testAuth = async (token: string | null) => {
  if (!token) {
    appState$.user.set({});
    console.log("No session");
    return null;
  }

  const res = await axios.get(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/auth/protected`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const status = res.status;
  if (status === 200) {
    console.log("Session is valid");
    appState$.user.token.set(token);
    appState$.user.userId.set(res.data.data.id);
    return res;
  }
  console.log("Session is invalid");
  appState$.user.set({});
  return res;
};

export const signOut = async () => {
  appState$.user.set({});
};
