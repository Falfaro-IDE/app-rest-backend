import { Redirect, Route } from "react-router-dom";
import { StorageService } from "../utils/storageService";

const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const authSession = StorageService.getItem("authSession");

  return (
    <Route
      {...rest}
      render={(props) =>
        authSession ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;