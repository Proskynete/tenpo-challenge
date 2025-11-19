import Cookies from "js-cookie";

const TOKEN_NAME = "_tenpo_token";

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_NAME, token, { expires: 7 });
};

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_NAME);
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_NAME);
};
