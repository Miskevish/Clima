import React from "react";
import { FaAd } from "react-icons/fa";
import "./SidebarPublicidad.css";

const SidebarPublicidad = () => {
  return (
    <aside className="sidebar-publicidad">
      <h3>Publicidad</h3>
      <div className="ad-box">
        <FaAd size={24} /> 
        <p>Espacio publicitario 1</p>
      </div>
      <div className="ad-box">
        <FaAd size={24} /> 
        <p>Espacio publicitario 2</p>
      </div>
    </aside>
  );
};

export default SidebarPublicidad;
