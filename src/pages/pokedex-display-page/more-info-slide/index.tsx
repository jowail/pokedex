import React, { useEffect, useState } from "react";
import { CustomCard } from "../../../components/custom-card/CustomCard";
import { PokemonDataResponseType } from "../../../services/apiRequestsTypes";
import { requestLinks } from "../../../services/apiRequests";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  BodyText,
  SecondaryText,
  StatTitleText,
} from "../../../utils/styledComponents";
import { TypeTag } from "../../../components/pokemon-information/type-tag";
import {
  abilitiesContainer,
  infoSlideContainer,
  infoSlideLoaderStyle,
  infoSlideScrollContainer,
  outterPokemonInfoSlideContainer,
  outterPokemonInfoSlideContainerMobile,
  noActivePokemonCardStyle,
  pokemonSpriteStyle,
  statsContainer,
  pokemonInfoSlideContainer,
} from "./style";
import { AbilityTag } from "../../../components/pokemon-information/ability-tag";
import { StatBar } from "../../../components/pokemon-information/stat-bar";
import { EvolutionChain } from "../../../components/pokemon-information/evolution-chain";
import { pokemonDataDefault } from "../../../utils/defaults";
import { capitalise } from "../../../utils/helpers";

import defaultImage from "../../../assets/default_pokemon_info.png";
import pokeballLoader from "../../../assets/pokeball-icon.png";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type MoreInfoSlideType = {
  pokedexData: Record<string, PokemonDataResponseType>;
  activePokemonData: PokemonDataResponseType;
  setActivePokemon: React.Dispatch<React.SetStateAction<string>>;
};

export const MoreInfoSlide: React.FC<MoreInfoSlideType> = ({
  pokedexData,
  activePokemonData,
  setActivePokemon,
}) => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [pokemonData, setPokemonData] =
    useState<PokemonDataResponseType>(pokemonDataDefault);
  const [pokemonAnimation, setPokemonAnimation] =
    useState<string>(defaultImage);
  const [hasSelectedActive, setHasSelectedActive] = useState<boolean>(false);
  const [transition, setTransition] = useState<Record<string, string>>(
    pokemonInfoSlideContainer
  );

  const handleSlideClose = () => {
    setActivePokemon("");
  };

  useEffect(() => {
    let dataTimer: ReturnType<typeof setTimeout> | null = null;
    // trigger translate
    if (activePokemonData) {
      setTransition(noActivePokemonCardStyle);
      // get all pokemon data
      dataTimer = setTimeout(() => setPokemonData(activePokemonData), 300);
    } else {
      // set default state
      setHasSelectedActive(false);
      setPokemonData(pokemonDataDefault);
      setPokemonAnimation(defaultImage);
    }

    return () => {
      if (dataTimer) clearTimeout(dataTimer);
    };
  }, [activePokemonData]);

  useEffect(() => {
    if (isTablet) {
      setTransition({
        ...transition,
        width: "100%",
      });
    } else {
      setTransition({ ...transition, width: "350px" });
    }
  }, [isTablet]);

  useEffect(() => {
    if (pokemonData.name) {
      // get animation sprite
      if (pokemonData.id > 650) {
        setPokemonAnimation(pokemonData.sprites.front_default);
      } else {
        setPokemonAnimation(requestLinks.getAnimatedSprite(pokemonData.id));
      }
      setHasSelectedActive(true);
    }
  }, [pokemonData]);

  return (
    <>
      {(!isTablet || (isTablet && activePokemonData)) && (
        <Box
          sx={
            isTablet
              ? outterPokemonInfoSlideContainerMobile(
                  pokemonData?.types[0]?.type.name
                )
              : outterPokemonInfoSlideContainer
          }
        >
          {isTablet && (
            <IconButton onClick={handleSlideClose}>
              <CloseRoundedIcon />
            </IconButton>
          )}
          <CustomCard sx={transition}>
            <Box
              component="img"
              src={pokemonAnimation}
              alt={`${activePokemonData?.species.name ?? "Default"}'s Sprite`}
              sx={pokemonSpriteStyle}
            />
            <Box sx={infoSlideScrollContainer}>
              <Box sx={infoSlideContainer}>
                {hasSelectedActive ? (
                  <Stack width="100%">
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

                    <Box
                      display="flex"
                      gap="10px"
                      m="10px"
                      justifyContent="center"
                    >
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

                    <EvolutionChain
                      pokedexData={pokedexData}
                      pokemonData={pokemonData}
                      setActivePokemon={setActivePokemon}
                      setTransition={setTransition}
                    />
                  </Stack>
                ) : (
                  <SecondaryText fontWeight="bold">
                    Please select a Pokemon.
                  </SecondaryText>
                )}
              </Box>
            </Box>
          </CustomCard>

          {!activePokemonData && (
            <Box
              component="img"
              src={pokeballLoader}
              alt="Loading"
              sx={infoSlideLoaderStyle}
            />
          )}
        </Box>
      )}
    </>
  );
};
