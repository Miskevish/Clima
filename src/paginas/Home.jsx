import React from "react";
import BackgroundParticles from "../componentes/BackgroundParticles";
import DatosInfo from "../componentes/DatosInfo";
import "./Home.css";

const Home = () => {
  return (
    <>
      <BackgroundParticles />

        <div className="home-clean-container">
        <DatosInfo />
      </div>
    </>
  );
};

export default Home;
