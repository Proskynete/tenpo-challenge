import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocale } from "@/utils/common";
import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

const browserLocale = getLocale();
const languageCode = browserLocale?.split("-")[0] || "es";

const supportedLanguages = ["en", "es"];
const defaultLanguage = supportedLanguages.includes(languageCode)
  ? languageCode
  : "es";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
