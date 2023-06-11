import { Box, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PokemonDataResponseType } from "../../../../services/apiRequestsTypes";
import {
  BodyText,
  Hoverable,
  SecondaryText,
} from "../../../../utils/styledComponents";
import {
  pokemonCardContainer,
  pokemonIdContainer,
  pokemonSpriteHover,
  pokemonSpriteStyle,
} from "./style";
import { TypeTag } from "../../../../components/pokemon-information/type-tag";
import { CustomCard } from "../../../../components/custom-card/CustomCard";
import {
  capitalise,
  capitaliseDash,
  removeDash,
} from "../../../../utils/helpers";

type PokemonCardProps = {
  pokedexEntryNum: number;
  pokemonData: PokemonDataResponseType;
  inSearchList: boolean;
  setActivePokemon: React.Dispatch<React.SetStateAction<string>>;
};

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokedexEntryNum,
  pokemonData,
  inSearchList,
  setActivePokemon,
}) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [hasImgLoaded, setHasImgLoaded] = useState<boolean>(false);

  const handleMouseOver = () => {
    setIsMouseOver(true);
  };
  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  /**
   * when card clicked set as active pokemon for the info slide
   */
  const handleCardClick = () => {
    setActivePokemon(pokemonData?.species.name);
  };

  // get initial pokemon data if the card is supposed to be displayed
  useEffect(() => {
    if (pokemonData?.species && inSearchList) {
      const name = pokemonData.species.name;
      name.includes("iron-")
        ? setDisplayName(capitalise(removeDash(name), true))
        : setDisplayName(capitaliseDash(name));
    }
  }, [inSearchList, pokemonData]);

  // check if sprite has loaded
  useEffect(() => {
    if (pokemonData?.sprites?.front_default) setHasImgLoaded(true);
  }, [pokemonData]);

  return (
    <>
      {inSearchList && (
        <Grid item xs={6} sm={6} md={4} lg={4} xl={3} height="210px">
          <Hoverable
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onClick={handleCardClick}
          >
            <CustomCard sx={pokemonCardContainer}>
              <Box sx={pokemonIdContainer}>
                <SecondaryText fontSize="12px" fontWeight="bold">
                  # {pokedexEntryNum}
                </SecondaryText>
              </Box>

              {hasImgLoaded ? (
                <Box
                  component="img"
                  draggable="false"
                  src={pokemonData?.sprites?.front_default}
                  alt={`${displayName}'s sprite`}
                  sx={isMouseOver ? pokemonSpriteHover : pokemonSpriteStyle}
                />
              ) : (
                <CircularProgress />
              )}
              <BodyText fontWeight="bold" fontSize="18px">
                {displayName}
              </BodyText>
              <Box display="flex" gap="10px" marginTop="5px">
                {pokemonData?.types.map((type) => (
                  <TypeTag type={type.type.name} key={type.slot} />
                ))}
              </Box>
            </CustomCard>
          </Hoverable>
        </Grid>
      )}
    </>
  );
};
