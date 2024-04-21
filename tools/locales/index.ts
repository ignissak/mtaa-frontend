import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { appState$ } from "../state";
import enTranslation from "./en.json";
import skTranslation from "./sk.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  sk: {
    translation: skTranslation,
  },
};

let init = false;

if (!init) {
  i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      compatibilityJSON: "v3",
      fallbackLng: "en",
      debug: true,
      resources,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      backend: {
        loadPath: "./{{lng}}.json",
      },
    });
  init = true;
}

const local = Localization.getLocales()[0].languageCode;
if (local !== null) {
  i18n.changeLanguage(local);
}

appState$.savedSettings.language.onChange((language) => {
  if (!language.value) {
    return;
  }
  console.log("Changed language to:", language.value);
  i18n.changeLanguage(language.value.split("_")[0].toLocaleLowerCase());
});

export default i18n;
