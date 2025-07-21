import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const BackgroundParticles = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
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
          retina_detect: true, 
        }}
      />
    </div>
  );
};

export default BackgroundParticles;
