import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import { PokemonNameResponseType } from "../../services/apiRequestsTypes";
import { PokemonCard } from "./pokemon-card";
import { triggerStorePokemonPromise } from "../../App";
import { homePageContainerStyle } from "./style";

export const HomePage: React.FC = () => {
  const [isNameListLoaded, setIsNameListLoaded] = useState<boolean>(false);
  const [visiblePokemonList, setVisiblePokemonList] = useState<
    PokemonNameResponseType[]
  >([]);
  const [currentPokemonLimit, setCurrentPokemonLimit] = useState<number>(30);

  /**
   * set current visible list of pokemon
   * @param pokemonList list of all pokemon names available from pokeapi
   */
  const getVisiblePokemonList = useCallback(
    (pokemonList: PokemonNameResponseType[]) => {
      const tempPokemonList: PokemonNameResponseType[] = [];
      for (let i = 0; i < currentPokemonLimit; i++) {
        tempPokemonList.push(pokemonList[i]);
      }
      setVisiblePokemonList(tempPokemonList);
    },
    [currentPokemonLimit]
  );

  /**
   * set pokemon list once
   */
  useEffect(() => {
    const pokemonList = JSON.parse(localStorage.getItem("pokemons") ?? "");
    if (pokemonList) {
      getVisiblePokemonList(pokemonList);
    } else {
      triggerStorePokemonPromise().then((data) => {
        getVisiblePokemonList(data);
      });
    }
  }, [getVisiblePokemonList]);

  // turn off loading screen to display pokemon cards
  useEffect(() => {
    if (visiblePokemonList) setIsNameListLoaded(true);
  }, [visiblePokemonList]);

  return (
    <>
      {isNameListLoaded ? (
        <Box sx={homePageContainerStyle}>
          <Box>
            <Box
              bgcolor="white"
              height="65px"
              borderRadius="15px"
              m="20px 0"
            ></Box>
            <Grid container columns={12} spacing="15px" marginTop="50px">
              {Array.from(visiblePokemonList).map((pokemon, index) => (
                <PokemonCard pokemonUrl={pokemon.url} key={index}></PokemonCard>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};
