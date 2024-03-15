import { useStorageState } from "../tools/useStorageState";

export const getSettingsStates = () => {
  const [userLanguage, setUserLanguage] = useStorageState("userLanguage");
  const [appearance, setAppearance] = useStorageState("appearance");
  const [visitedPublic, setVisitedPublic] = useStorageState("visitedPublic");

  return {
    userLanguage,
    setUserLanguage,
    appearance,
    setAppearance,
    visitedPublic,
    setVisitedPublic,
  };
};
