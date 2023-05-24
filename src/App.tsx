import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/home-page";

export const POKEMON_MAX_NUM = 898;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={HomePage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
