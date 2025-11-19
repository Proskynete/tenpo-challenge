import { getLocale } from "./common";

export const formatDate = (date: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  if (date instanceof Date) {
    return date.toLocaleDateString(getLocale(), options);
  } else {
    return new Date(date).toLocaleDateString(getLocale(), options);
  }
};
