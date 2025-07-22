import React from "react";
import BackgroundParticles from "../componentes/BackgroundParticles";
import DatosInfo from "../componentes/DatosInfo";
import "./Home.css";

const Home = () => {
  return (
    <>
      {/* Fondo animado para un efecto moderno */}
      <BackgroundParticles />

      {/* Contenedor principal que ya incluye todo el layout */}
      <div className="home-clean-container">
        <DatosInfo />
      </div>
    </>
  );
};

export default Home;
