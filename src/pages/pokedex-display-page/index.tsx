import React, { useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  PokemonDataResponseType,
  PokemonDexResponseType,
  PokemonPokedexEntryType,
  PokemonSpeciesResponseType,
} from "../../services/apiRequestsTypes";
import { pageContainerStyle, tabletPageContainerStyle } from "./style";
import {
  requestLinks,
  sendGenericAPIRequest,
} from "../../services/apiRequests";
import { PokedexDisplay } from "./pokedex-display";
import { MoreInfoSlide } from "./more-info-slide";
import { getIdFromLink } from "../../utils/helpers";

export type PokedexDisplayrops = {
  generation: string;
};

export const PokedexDisplayPage: React.FC<PokedexDisplayrops> = ({
  generation,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [pokedexEntries, setPokedexEntries] = useState<
    PokemonPokedexEntryType[]
  >([]);
  const [activePokemon, setActivePokemon] = useState<string>("");

  const [pokedexData, setPokedexData] = useState<
    Record<string, PokemonDataResponseType>
  >({});

  // get kalos dex
  const getKalosDex = async () => {
    const kalosPromises: Promise<void | PokemonDexResponseType>[] = [
      sendGenericAPIRequest<PokemonDexResponseType>(
        requestLinks.getPokedex("kalos-central")
      ),
      sendGenericAPIRequest<PokemonDexResponseType>(
        requestLinks.getPokedex("kalos-coastal")
      ),
      sendGenericAPIRequest<PokemonDexResponseType>(
        requestLinks.getPokedex("kalos-mountain")
      ),
    ];

    Promise.all(kalosPromises).then((responses) => {
      let kalosDex: PokemonPokedexEntryType[] = [];
      for (const response of responses) {
        if (response) kalosDex = [...kalosDex, ...response.pokemon_entries];
      }
      setPokedexEntries([...kalosDex]);
    });
  };

  /**
   * pushes api requests to get a pokemon's data (promises) into the the array
   * @param dataPromises async api requests to get a pokemon's data array
   * @param dataHolder where data goes when api request is finished
   * @param id id of pokemon
   * @param speciesName name of the pokemon species
   */
  const getPokedexDataPromises = (
    dataPromises: Promise<void | PokemonDataResponseType>[],
    dataHolder: Record<string, PokemonDataResponseType> = {},
    id: number,
    speciesName: string
  ) => {
    dataPromises.push(
      sendGenericAPIRequest<PokemonDataResponseType>(
        requestLinks.getData(id)
      ).then((data) => {
        if (data) dataHolder[speciesName] = data;
      })
    );
  };

  /**
   * pushes api requests to get a pokemon's species (promises) into the the array
   * @param speciesPromises async api requests to get a pokemon's species array
   * @param id id of the pokemon
   * @param speciesName name of the pokemon species
   */
  const getRegionalFormPromises = (
    regionalPromises: Promise<void | PokemonDataResponseType>[],
    regionalHolder: Record<string, PokemonDataResponseType> = {},
    id: number,
    speciesName: string
  ) => {
    sendGenericAPIRequest<PokemonSpeciesResponseType>(
      requestLinks.getSpecies(id)
    ).then((species) => {
      if (!species) return;
      // check for regional forms
      for (const form of species.varieties) {
        const match = form.pokemon.name.match(
          new RegExp(`^${speciesName}-${generation.replace("original-", "")}$`)
        );
        if (match) {
          // regional form found
          regionalPromises.push(
            sendGenericAPIRequest<PokemonDataResponseType>(
              requestLinks.getData(getIdFromLink(form.pokemon.url))
            ).then((regional) => {
              if (regional) regionalHolder[speciesName] = regional;
            })
          );
          break;
        }
      }
    });
  };

  // get all pokename in region pokedex
  useEffect(() => {
    setActivePokemon("");
    setHasLoaded(false);

    if (generation === "kalos") {
      getKalosDex();
    } else {
      sendGenericAPIRequest<PokemonDexResponseType>(
        requestLinks.getPokedex(generation)
      ).then((data) => {
        if (data) setPokedexEntries(data.pokemon_entries);
      });
    }
  }, [generation]);

  // get all pokemon's data
  useEffect(() => {
    if (pokedexEntries.length <= 0) return;
    const dataPromises: Promise<void | PokemonDataResponseType>[] = [];
    const regionalPromises: Promise<void | PokemonDataResponseType>[] = [];

    const dataHolder: Record<string, PokemonDataResponseType> = {};
    const regionalHolder: Record<string, PokemonDataResponseType> = {};

    for (const entry of pokedexEntries) {
      const id = parseInt(entry.pokemon_species.url.split("/")[6]);
      const speciesName = entry.pokemon_species.name;

      getPokedexDataPromises(dataPromises, dataHolder, id, speciesName);
      getRegionalFormPromises(
        regionalPromises,
        regionalHolder,
        id,
        speciesName
      );
    }

    Promise.allSettled(dataPromises).then(() => {
      Promise.allSettled(regionalPromises).then(() => {
        for (const regional of Object.keys(regionalHolder)) {
          dataHolder[regional] = regionalHolder[regional];
        }
        setPokedexData(dataHolder);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokedexEntries]);

  // pokemon list finished fetching from api
  useEffect(() => {
    if (Object.keys(pokedexData).length > 0) setHasLoaded(true);
  }, [pokedexData]);

  return (
    <Box sx={isTablet ? tabletPageContainerStyle : pageContainerStyle}>
      <Box width="100%" maxWidth="1200px">
        <PokedexDisplay
          generation={generation}
          pokedexList={pokedexEntries}
          pokedexData={pokedexData}
          displaySearch
          listLoaded={hasLoaded}
          setActivePokemon={setActivePokemon}
        />
      </Box>
      <Box>
        <MoreInfoSlide
          pokedexData={pokedexData}
          activePokemonData={pokedexData[activePokemon]}
          setActivePokemon={setActivePokemon}
        />
      </Box>
    </Box>
  );
};
