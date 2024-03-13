import { AxiosResponse } from "axios";
import React from "react";
import { login } from "../api/auth";
import { useStorageState } from "./useStorageState";

export const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<AxiosResponse<any, any>>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  userId?: string | null;
}>({
  signIn: (email: string, password: string) =>
    Promise.resolve({} as AxiosResponse<any, any>),
  signOut: () => null,
  session: null,
  isLoading: false,
  userId: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  // store userId
  const [[_, userId], setUserId] = useStorageState("userId");

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          return new Promise((resolve, reject) => {
            login(email, password)
              .then((res) => {
                if (res.status === 200) {
                  setSession(res.data.data.access_token);
                  setUserId(JSON.stringify(res.data.data.userId));
                }
                resolve(res);
              })
              .catch((e) => {
                console.error(e);
                reject(e);
              });
          });
          /* return login(email, password).then(res => {
            if (res.status === 200) {
              setSession(res.data.data.access_token);
              setUserId(JSON.parse(res.data.data.userId));
            }
            return res;
          }).catch(e => {
            console.error(e);
          }); */
        },
        signOut: () => {
          setSession(null);
          setUserId(null);
        },
        session,
        isLoading,
        userId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
