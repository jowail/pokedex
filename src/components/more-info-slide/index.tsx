import React, { useEffect, useState } from "react";
import { CustomCard } from "../custom-card/CustomCard";
import { PokemonDataResponseType } from "../../services/apiRequestsTypes";
import {
  requestLinks,
  sendGenericAPIRequest,
} from "../../services/apiRequests";
import { Box } from "@mui/material";
import {
  BodyText,
  SecondaryText,
  StatTitleText,
} from "../../utils/styledComponents";
import { TypeTag } from "../pokemon-information/type-tag";
import {
  abilitiesContainer,
  activePokemonSpriteStyle,
  infoSlideContainer,
  noActivePokemonCardStyle,
  noActivePokemonSpriteStyle,
  pokemonInfoSlideContainer,
  statsContainer,
} from "./style";
import { AbilityTag } from "../pokemon-information/ability-tag";
import { StatBar } from "../pokemon-information/stat-bar";
import { EvolutionChain } from "../pokemon-information/evolution-chain";
import { pokemonDataDefault } from "../../utils/defaults";
import { capitalise } from "../../utils/helpers";

import defaultImage from "../../assets/default_pokemon_info.png";
import pokeballLoader from "../../assets/pokeballIcon.png";

type MoreInfoSlideType = {
  activePokemonName: string;
  setActivePokemonName: React.Dispatch<React.SetStateAction<string>>;
};

export const MoreInfoSlide: React.FC<MoreInfoSlideType> = ({
  activePokemonName,
  setActivePokemonName,
}) => {
  const [pokemonData, setPokemonData] =
    useState<PokemonDataResponseType>(pokemonDataDefault);
  const [pokemonAnimation, setPokemonAnimation] =
    useState<string>(defaultImage);
  const [pokemonName, setPokemonName] = useState<string>("");
  const [hasSelectedActive, setHasSelectedActive] = useState<boolean>(false);
  const [transition, setTransition] = useState<Record<string, string>>(
    pokemonInfoSlideContainer
  );

  useEffect(() => {
    // trigger translate
    if (activePokemonName) {
      console.log(activePokemonName);

      setTransition(noActivePokemonCardStyle);
      // get all pokemon data
      sendGenericAPIRequest<PokemonDataResponseType>(
        requestLinks.getData(activePokemonName)
      ).then((data) => {
        if (data) setPokemonData(data);
      });
    }
  }, [activePokemonName]);

  useEffect(() => {
    if (pokemonData.name) {
      // get name
      setPokemonName(capitalise(pokemonData.name));
      // get animation sprite
      if (pokemonData.id > 650) {
        setPokemonAnimation(pokemonData.sprites.front_default);
      } else {
        setPokemonAnimation(requestLinks.getAnimatedSprite(pokemonData.id));
      }
      // timer to setTransition so previous transition has time to slide out
      setHasSelectedActive(true);
    }
  }, [pokemonData]);

  return (
    <Box sx={{ width: "350px" }}>
      <CustomCard sx={transition}>
        <>
          <Box sx={infoSlideContainer}>
            <Box
              component="img"
              src={pokemonAnimation}
              alt={`${pokemonName ?? "Default"}'s Sprite`}
              sx={
                pokemonName
                  ? activePokemonSpriteStyle
                  : noActivePokemonSpriteStyle
              }
            />
            {hasSelectedActive ? (
              <>
                <SecondaryText
                  fontSize="12px"
                  fontWeight="bold"
                  marginBottom="-5px"
                >
                  # {pokemonData.id}
                </SecondaryText>
                <BodyText fontWeight="bold" fontSize="24px">
                  {capitalise(pokemonData.species.name)}
                </BodyText>

                <Box display="flex" gap="10px" m="10px">
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
                  pokemonData={pokemonData}
                  setActivePokemonName={setActivePokemonName}
                  setTransition={setTransition}
                />
              </>
            ) : (
              <SecondaryText>Please select a Pokemon.</SecondaryText>
            )}
          </Box>
        </>
      </CustomCard>
    </Box>
  );
};
