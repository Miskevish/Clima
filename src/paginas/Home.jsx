import React from "react";
import BackgroundParticles from "../componentes/BackgroundParticles";
import DatosInfo from "../componentes/DatosInfo";
import "./Home.css";

const Home = () => {
  return (
    <>
      
      <BackgroundParticles />

      
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
          
            <DatosInfo />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
