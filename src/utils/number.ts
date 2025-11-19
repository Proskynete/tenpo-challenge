import { getLocale } from "./common";

export const formatNumber = (number: number): string => {
  return number.toLocaleString(getLocale(), { maximumFractionDigits: 2 });
};
