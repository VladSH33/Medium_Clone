import React from "react";
import { Route, Routes } from "react-router-dom";
import { privateRoutes } from "./routes";
import GlobalFeed from "../pages/GlobalFeed/GlobalFeed";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<GlobalFeed to="/globalFeed" replace />} />
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
