import React from "react";
import LoginScreen from "./Screens/LoginScreen";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardScreen from "./Screens/DashboardScreen";
import { PrivateRoute, PublicRoute } from "./Routes/Routes";
import ChatScreen from "./Screens/ChatScreen";

import "./api/socket";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/">
          <Route index element={<Navigate to="/sign-in"></Navigate>} />
          <Route element={<PublicRoute />}>
            <Route path="sign-in" element={<LoginScreen />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="chat" element={<DashboardScreen />}>
              <Route path="cabinet" element={<p>Cabinet Route</p>} />
              <Route path="general" element={<ChatScreen />} />
              <Route path="privat" element={<p>Private Chat Route</p>} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/sign-in"></Navigate>} />
      </Routes>
    </div>
  );
};

export default App;
