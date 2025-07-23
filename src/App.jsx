import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import "./App.css";
import GoogleAnalytics from "./componentes/GoogleAnalytics.jsx";

function App() {
  return (
    <Router>
      <GoogleAnalytics />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
