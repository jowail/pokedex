import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pokemonDataDefault } from "../../utils/defaults";
import { Box, SxProps, Theme } from "@mui/material";
import { typeColours } from "../../utils/colours";
import {
  requestLinks,
  sendGenericAPIRequest,
} from "../../services/apiRequests";
import { PokemonDataResponseType } from "../../services/apiRequestsTypes";
import { NAVBAR_HEIGHT } from "../../components/navbar/style";

const pokemonInfoPageStyle = (type: string): SxProps<Theme> => {
  const defaultPageStyle = {
    minWidth: "100%",
    minHeight: "100vh",
    transition: "all 0.3s ease",
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

  return <Box sx={pokemonInfoPageStyle(pokemonType)}></Box>;
};
