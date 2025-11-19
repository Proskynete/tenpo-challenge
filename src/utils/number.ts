import { getLocale } from "./common";

export const formatNumber = (number: number): string => {
  return Intl.NumberFormat(getLocale()).format(number);
};
