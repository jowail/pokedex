import React, { useCallback, useEffect, useState } from "react";
import {
  requestLinks,
  sendGenericAPIRequest,
} from "../../../services/apiRequests";
import {
  NameUrlType,
  PokemonEvoChainType,
  PokemonEvoDetailsType,
  PokemonEvolutionResponseType,
  PokemonSpeciesResponseType,
} from "../../../services/apiRequestsTypes";
import { pokemonEvoDetailsDefault } from "../../../utils/defaults";
import { Box, Tooltip } from "@mui/material";
import { PokemonDataResponseType } from "../../../services/apiRequestsTypes";
import { Hoverable, StatTitleText } from "../../../utils/styledComponents";
import { EvolutionMethod } from "./evolution-method";
import {
  pokemonEvoSpriteStyle,
  pokemonEvoStageContainer,
  pokemonEvolutionContainer,
} from "./style";
import { capitalise } from "../../../utils/helpers";
import { pokemonInfoSlideContainer } from "../../../pages/pokedex-display-page/more-info-slide/style";

type EvoStages = StageInfo[][];

export type StageInfo = {
  name: string;
  methods: Record<string, any>;
  trigger: NameUrlType;
};

type EvolutionChainProps = {
  pokedexData: Record<string, PokemonDataResponseType>;
  pokemonData: PokemonDataResponseType;
  setActivePokemon?: React.Dispatch<React.SetStateAction<string>>;
  setTransition?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export const EvolutionChain: React.FC<EvolutionChainProps> = ({
  pokedexData,
  pokemonData,
  setActivePokemon,
  setTransition,
}) => {
  const [evolutionStages, setEvolutionStages] = useState<EvoStages>([]);

  // recursively traverse the evolution tree and add it to per level array
  const evoTreeTraverse = useCallback(
    (root: PokemonEvoChainType, level: number, evoStages: EvoStages) => {
      if (!root.species) return;
      const details: PokemonEvoDetailsType =
        root.evolution_details.length !== 0
          ? root.evolution_details[0]
          : pokemonEvoDetailsDefault;

      const evolveMethods: Record<string, any> = {};
      Object.keys(details).forEach((key) => {
        const keyTyped = key as keyof PokemonEvoDetailsType;
        const keyString = key as string;

        if (keyString !== "trigger" && details[keyTyped]) {
          if (typeof evolveMethods[keyString] === "object") {
            const nameUrlDetail = details[keyTyped] as NameUrlType;
            evolveMethods[nameUrlDetail.name] = nameUrlDetail.url;
          } else {
            evolveMethods[keyString] = details[keyTyped];
          }
        }
      });

      const pokemonName = root.species.name;

      const currStage: StageInfo = {
        name: pokemonName,
        methods: evolveMethods,
        trigger: details.trigger,
      };

      if (!evoStages[level]) evoStages.push([]);
      if (pokedexData[pokemonName]) evoStages[level].push(currStage);

      // traverse tree
      root.evolves_to.forEach((evolveTo) => {
        evoTreeTraverse(evolveTo, level + 1, evoStages);
      });
    },
    [pokedexData]
  );

  /**
   * click on an evo to change active pokemon (slide change)
   * @param name name of pokem on clicked on
   */
  const handleEvoClick = (name: string) => {
    if (setActivePokemon && name !== pokemonData.species.name)
      setActivePokemon(name);
  };

  // get evolution data
  useEffect(() => {
    if (pokemonData)
      sendGenericAPIRequest<PokemonSpeciesResponseType>(
        requestLinks.getSpecies(pokemonData.species.name),
        () => setEvolutionStages([])
      ).then((data) => {
        if (data) {
          sendGenericAPIRequest<PokemonEvolutionResponseType>(
            `${data?.evolution_chain.url}`
          ).then((data) => {
            if (data) {
              const evoStagesTemp: EvoStages = [];
              evoTreeTraverse(data.chain, 0, evoStagesTemp);
              // get rid of any unnecessary methods/trigger if there is not prev evo
              for (let i = 1; i < evoStagesTemp.length; i++) {
                if (evoStagesTemp[i - 1].length === 0)
                  for (const evo of evoStagesTemp[i]) {
                    evo.methods = {};
                    evo.trigger = { name: "", url: "" };
                  }
              }
              setEvolutionStages(evoStagesTemp);
            }
          });
        }
      });
  }, [evoTreeTraverse, pokemonData]);

  useEffect(() => {
    let transitionInTimer: ReturnType<typeof setTimeout> | null = null;

    if (evolutionStages.length > 0 && setTransition)
      transitionInTimer = setTimeout(() => {
        setTransition(pokemonInfoSlideContainer);
      }, 400);

    return () => {
      if (transitionInTimer) clearTimeout(transitionInTimer);
    };
  }, [evolutionStages, setTransition]);

  useEffect(() => {
    setEvolutionStages([]);
  }, [pokemonData]);

  return (
    <>
      {evolutionStages.length > 1 && (
        <>
          <StatTitleText fontSize="16px">Evolution</StatTitleText>
          <Box display="flex" justifyContent="center">
            {evolutionStages.map((stage, index_i) => (
              <Box key={index_i} sx={pokemonEvoStageContainer}>
                {stage.map((evo, index_j) => (
                  <Box sx={pokemonEvolutionContainer} key={index_j}>
                    <EvolutionMethod stageInfo={evo} />
                    <Tooltip title={capitalise(evo.name)}>
                      <Hoverable onClick={() => handleEvoClick(evo.name)}>
                        <Box
                          component="img"
                          src={pokedexData[evo.name].sprites.front_default}
                          alt={`${evo.name}'s sprite`}
                          sx={pokemonEvoSpriteStyle}
                        />
                      </Hoverable>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </>
      )}
    </>
  );
};
