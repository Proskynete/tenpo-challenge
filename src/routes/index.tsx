import { lazy } from "react";
import { Redirect, Route, Switch } from "wouter";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { LC } from "./LazyComponent";

const Home = LC(lazy(() => import("../pages/Home")));
const Login = LC(lazy(() => import("../pages/Login")));

export const Router = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route>
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
};
