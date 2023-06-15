import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pokemonDataDefault } from "../../utils/defaults";
import { Box, Stack, SxProps, Theme } from "@mui/material";
import { typeColours } from "../../utils/colours";
import {
  requestLinks,
  sendGenericAPIRequest,
} from "../../services/apiRequests";
import { PokemonDataResponseType } from "../../services/apiRequestsTypes";
import { NAVBAR_HEIGHT } from "../../components/navbar/style";
import {
  BodyText,
  SecondaryText,
  StatTitleText,
} from "../../utils/styledComponents";
import { TypeTag } from "../../components/pokemon-information/type-tag";
import { capitalise } from "../../utils/helpers";
import { AbilityTag } from "../../components/pokemon-information/ability-tag";
import {
  abilitiesContainer,
  statsContainer,
} from "../pokedex-display-page/more-info-slide/style";
import { StatBar } from "../../components/pokemon-information/stat-bar";

const infoContainerStyle = {
  bgcolor: "white",
  width: "calc(100vw - 20px)",
  borderRadius: "20px 20px 0 0",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  transition: "all 0.5s ease",
};

const pokemonInfoPageStyle = (type: string): SxProps<Theme> => {
  const defaultPageStyle: SxProps<Theme> = {
    minWidth: "100%",
    minHeight: "100vh",
    transition: "all 0.3s ease",
    paddingTop: `calc(${NAVBAR_HEIGHT} + 200px)`,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  };
  if (type) {
    return {
      ...defaultPageStyle,
      bgcolor: typeColours[type],
      marginTop: `-${NAVBAR_HEIGHT}`,
    };
  }
  return defaultPageStyle;
};

export const PokemonInfoPage = () => {
  const { activeId } = useParams();
  const [pokemonData, setPokemonData] =
    useState<PokemonDataResponseType>(pokemonDataDefault);
  const [pokemonType, setPokemonType] = useState<string>("");

  useEffect(() => {
    if (activeId) {
      sendGenericAPIRequest<PokemonDataResponseType>(
        requestLinks.getData(activeId)
      ).then((data) => {
        if (data) setPokemonData(data);
      });
    }
  }, [activeId]);

  useEffect(() => {
    if (pokemonData?.types[0]) setPokemonType(pokemonData.types[0].type.name);
  }, [pokemonData]);

  return (
    <Box sx={pokemonInfoPageStyle(pokemonType)}>
      <Box
        sx={
          pokemonData.name
            ? infoContainerStyle
            : { ...infoContainerStyle, transform: "translateY(100vh)" }
        }
      >
        {pokemonData.name && (
          <>
            <Box
              component="img"
              alt={pokemonData.name ?? ""}
              src={pokemonData.sprites.front_default}
              sx={{
                position: "absolute",
                imageRendering: "pixelated",
                width: "400px",
                top: "-200px",
              }}
            />

            <Box
              sx={{
                paddingTop: "200px",
                maxWidth: "1000px",
              }}
            >
              <Stack width="100%" display="flex" justifyContent="center">
                <SecondaryText
                  fontSize="12px"
                  fontWeight="bold"
                  marginBottom="-5px"
                >
                  N# {pokemonData.id}
                </SecondaryText>
                <BodyText fontWeight="bold" fontSize="24px">
                  {capitalise(pokemonData.species.name)}
                </BodyText>
                <Box display="flex" gap="10px" m="10px" justifyContent="center">
                  {pokemonData.types.map((type, index) => (
                    <TypeTag type={type.type.name} key={index} />
                  ))}
                </Box>
                <StatTitleText fontSize="16px">Abilities</StatTitleText>
                <Box sx={abilitiesContainer}>
                  {pokemonData.abilities.map((ability, index) => (
                    <AbilityTag abilityInfo={ability} key={index} />
                  ))}
                </Box>
                <StatTitleText fontSize="16px">Base Stats</StatTitleText>
                <Box sx={statsContainer}>
                  {pokemonData.stats.map((statInfo, index) => (
                    <StatBar
                      stat={statInfo.stat.name}
                      value={statInfo.base_stat}
                      key={index}
                    />
                  ))}
                </Box>
                {/* <EvolutionChain
                pokedexData={pokedexData}
                pokemonData={pokemonData}
                setActivePokemon={setActivePokemon}
                setTransition={setTransition}
              /> */}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
