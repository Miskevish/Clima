import React from "react";
import SidebarPublicidad from "../componentes/SidebarPublicidad";
import "./Home.css";
import { WiDaySunny } from "react-icons/wi";
import BackgroundParticles from "../componentes/BackgroundParticles";

const Home = () => {
  return (
    <>
      {/* Fondo animado de partículas */}
      <BackgroundParticles />

      {/* Contenedor principal */}
      <div className="home-container">
        {/* Contenido principal */}
        <div className="main-content">
          <h1>
            WeatherApp <WiDaySunny size={40} />
          </h1>
          <p>Consulta el clima actual en tu ciudad y el precio del dólar blue en tiempo real.</p>
        </div>

        {/* Publicidad lateral en PC */}
        <SidebarPublicidad />
      </div>
    </>
  );
};

export default Home;
