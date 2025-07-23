import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // ✅ Usa slim para evitar el error

const BackgroundParticles = () => {
  const particlesInit = async (engine) => {
    // ✅ Carga solo las funciones necesarias para evitar checkVersion
    await loadSlim(engine);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: "transparent",
          },
          particles: {
            number: {
              value: 80,
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.3,
            },
            size: {
              value: 3,
            },
            move: {
              enable: true,
              speed: 1,
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
          detectRetina: true, // ✅ versión correcta para retina
        }}
      />
    </div>
  );
};

export default BackgroundParticles;
