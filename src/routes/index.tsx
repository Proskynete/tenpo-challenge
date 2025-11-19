import { Redirect, Route, Switch } from "wouter";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";

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
