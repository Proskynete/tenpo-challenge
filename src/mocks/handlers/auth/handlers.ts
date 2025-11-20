import { http } from "msw";

import { signIn } from "./resolvers/sign-in.handler";
import { signOut } from "./resolvers/sign-out.handler";
import { signUp } from "./resolvers/sign-up.handler";

const endpoints = {
  signIn: "*/v1/auth/sign-in",
  signOut: "*/v1/auth/sign-out",
  signUp: "*/v1/auth/sign-up",
};

const handlers = [
  http.post(endpoints.signIn, signIn),
  http.post(endpoints.signOut, signOut),
  http.post(endpoints.signUp, signUp),
];

export default handlers;
