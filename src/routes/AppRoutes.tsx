import React from "react";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import { Redirect, Route, Router } from "react-router";
import { SidebarProvider } from "../components/compartidos/SidebarContext";
import Password from "../pages/Password/Password";
import Correo from "../pages/Password/Correo";
import values from "../models/clases/values";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Route  path={values.rutas.rutas.homePrincipal.rutaPrincipal+"/*"}>
        <SidebarProvider>
          <Home />
        </SidebarProvider>
      </Route>
      <Route exact path={values.rutas.rutas.login}>
        <Login />
      </Route>
      <Route exact path={values.rutas.rutas.enviarCorreo}>
        <Correo />
      </Route>
      <Route exact path={values.rutas.rutas.resetPassword}>
        <Password />
      </Route>
      <Route exact path="/">
        <Redirect to={values.rutas.rutas.login} />
      </Route>
    </>
  );
};

export default AppRoutes;