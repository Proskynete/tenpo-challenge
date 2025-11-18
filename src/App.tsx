import { Route, Switch, Redirect } from "wouter";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
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

export default App;
