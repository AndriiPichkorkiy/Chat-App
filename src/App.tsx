import React from "react";
import LoginScreen from "./Screens/LoginScreen";
import { Routes, Route } from "react-router-dom";
import ChatScreen from "./Screens/ChatScreen";

// function App() {
//   return <div className="App"></div>;
// }

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>

      {/* <LoginScreen /> */}
    </div>
  );
};

export default App;
