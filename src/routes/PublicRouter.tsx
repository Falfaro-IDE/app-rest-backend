import { Route, Redirect } from "react-router-dom";
import { StorageService } from "../utils/storageService";


const PublicRoute = ({ children, ...rest }: any) => {
  const authSession = StorageService.getItem("authSession"); // Verifica sesión

  return (
    <Route
      {...rest}
      render={() =>
        authSession ? <Redirect to="/rest/bienvenida" /> : children
      }
    />
  );
};

export default PublicRoute;