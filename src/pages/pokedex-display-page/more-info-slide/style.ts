import { keyframes } from "@emotion/react";
import { fontBgColour, typeBorderColours } from "../../../utils/colours";

export const outterPokemonInfoSlideContainer = {
  width: "350px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const outterPokemonInfoSlideContainerMobile = (type: string) => {
  return {
    position: "fixed",
    top: "0",
    right: "0",
    height: "100%",
    width: "100%",
    backgroundColor: `${typeBorderColours[type]}90`,
    zIndex: "3",
    transition: "all 0.2s ease",
  };
};

export const pokemonInfoSlideContainer = {
  width: "350px",
  height: "78vh",
  position: "fixed",
  bottom: "-10px",
  transition: "transform 0.3s ease-out",
  display: "flex",
  justifyContent: "center",
};

export const noActivePokemonCardStyle = {
  ...pokemonInfoSlideContainer,
  transform: "translateX(500px)",
};

export const infoSlideScrollContainer = {
  display: "flex",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
};

export const infoSlideContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "calc(100% + 14px)",
  height: "100%",
  boxSizing: "border-box",
  padding: "90px 20px 50px 20px",
  textAlign: "center",
  overflow: "scroll",
  overflowX: "hidden",
  position: "absolute",
};

export const pokemonSpriteStyle = {
  position: "absolute",
  bottom: "100%",
  imageRendering: "pixelated",
  overflowClipMargin: "content-box",
  transform: "scale(3)",
  zIndex: "1",
};

export const abilitiesContainer = {
  display: "flex",
  flexFlow: "row wrap",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: `${fontBgColour}`,
  borderRadius: "15px",
  width: "100%",
  padding: "15px 0",
};

export const statsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  justifyContent: "center",
  padding: "0 12px",
};

const spinAnimate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const infoSlideLoaderStyle = {
  position: "fixed",
  animation: `${spinAnimate} 2s linear infinite`,
  width: "70px",
  top: "50vh",
  zIndex: "-1",
};
