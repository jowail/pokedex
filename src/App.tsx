import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PokedexDisplayPage } from "./pages/pokedex-display-page";

import { MoveToTop } from "./components/move-to-top";
import { Navbar } from "./components/navbar";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { NAVBAR_HEIGHT } from "./components/navbar/style";
import { PokemonInfoPage } from "./pages/pokemon-info-page";

const theme = createTheme({
  palette: {
    primary: {
      light: "#f0f3f8",
      main: "#c3c9cf",
    },
    text: {
      primary: "#0c214a",
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Box height={`${NAVBAR_HEIGHT}`} />
        <MoveToTop />
        <Routes>
          <Route
            path="/"
            element={<PokedexDisplayPage generation="national" />}
          />
          <Route
            path="/kanto"
            element={<PokedexDisplayPage generation="kanto" />}
          />
          <Route
            path="/johto"
            element={<PokedexDisplayPage generation="original-johto" />}
          />
          <Route
            path="/hoenn"
            element={<PokedexDisplayPage generation="hoenn" />}
          />
          <Route
            path="/sinnoh"
            element={<PokedexDisplayPage generation="original-sinnoh" />}
          />
          <Route
            path="/unova"
            element={<PokedexDisplayPage generation="original-unova" />}
          />
          <Route
            path="/kalos"
            element={<PokedexDisplayPage generation="kalos" />}
          />
          <Route
            path="/alola"
            element={<PokedexDisplayPage generation="original-alola" />}
          />
          <Route
            path="/galar"
            element={<PokedexDisplayPage generation="galar" />}
          />
          <Route
            path="/hisui"
            element={<PokedexDisplayPage generation="hisui" />}
          />
          <Route
            path="/paldea"
            element={<PokedexDisplayPage generation="paldea" />}
          />
          <Route path="/pokemon/:activeId" element={<PokemonInfoPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
