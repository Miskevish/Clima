import React, { useState, useEffect } from "react";
import axios from "axios";

import sunIcon from "../assets/weather-icons/sun.png";
import moonIcon from "../assets/weather-icons/moon.png";
import lluviaLigeraIcon from "../assets/weather-icons/lluvia-ligera.png";
import lluviaIntensaIcon from "../assets/weather-icons/lluvia-intensa.png";
import lloviznaIcon from "../assets/weather-icons/llovizna.png";
import stormIcon from "../assets/weather-icons/storm.png";
import parcialmenteNubladoIcon from "../assets/weather-icons/parcialmente-nublado.png";
import parcialmenteNubladoNocheIcon from "../assets/weather-icons/parcialmente-nublado-noche.png";
import nubladoIcon from "../assets/weather-icons/nublado.png";

import WeatherTrendChart from "./WeatherTrendChart";
import "./DatosInfo.css";

const DatosInfo = () => {
  const [climaActual, setClimaActual] = useState(null);
  const [pronostico, setPronostico] = useState([]);
  const [ubicacion, setUbicacion] = useState("");
  const [ciudadBuscada, setCiudadBuscada] = useState("");
  const [error, setError] = useState(null);
  const [dolar, setDolar] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  const WEATHER_KEY = import.meta.env.VITE_WEATHERAPI_KEY;
  const GEODB_KEY = import.meta.env.VITE_GEODB_KEY;

  const obtenerSugerencias = async (query) => {
    if (!query.trim()) return setSugerencias([]);
    try {
      const res = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&countryIds=AR`,
        {
          headers: {
            "X-RapidAPI-Key": GEODB_KEY,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );
      setSugerencias(res.data.data.slice(0, 5));
    } catch (err) {
      console.error("Error obteniendo sugerencias:", err);
    }
  };

  const obtenerClima = async (ciudad) => {
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${ciudad}&days=10&lang=es`
      );
      setClimaActual(res.data.current);
      setPronostico(res.data.forecast.forecastday);
      setUbicacion(`${res.data.location.name}, ${res.data.location.country}`);
      setError(null);
    } catch (err) {
      console.error("Error obteniendo clima:", err);
      setError("No se pudo obtener el clima.");
    }
  };

  const handleBuscarCiudad = (e) => {
    e.preventDefault();
    if (!ciudadBuscada.trim()) return;
    obtenerClima(ciudadBuscada);
    setSugerencias([]);
  };

  const obtenerDolar = async () => {
    try {
      const res = await axios.get("https://api.bluelytics.com.ar/v2/latest");
      setDolar(res.data);
    } catch (err) {
      console.error("Error obteniendo dólar:", err);
    }
  };

  useEffect(() => {
    obtenerClima("Buenos Aires, Argentina");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          obtenerClima(`${lat},${lon}`);
        },
        () => {
          console.log(
            "Geolocalización rechazada, usando Buenos Aires por defecto"
          );
        }
      );
    }
    obtenerDolar();
  }, []);

  useEffect(() => {
    if (!ciudadBuscada.trim()) {
      setSugerencias([]);
      return;
    }
    const delay = setTimeout(() => {
      obtenerSugerencias(ciudadBuscada);
    }, 500);
    return () => clearTimeout(delay);
  }, [ciudadBuscada]);

  const obtenerIcono = (condicion, contexto = "general") => {
    const desc = condicion.toLowerCase();
    const hora = new Date().getHours();
    const esNoche = hora >= 19 || hora < 6;

    if (desc.includes("tormenta")) return stormIcon;
    if (desc.includes("lluvia intensa")) return lluviaIntensaIcon;
    if (desc.includes("lluvia moderada")) return lluviaLigeraIcon;
    if (desc.includes("llovizna")) return lloviznaIcon;
    if (desc.includes("lluvia")) return lluviaLigeraIcon;
    if (desc.includes("nublado")) return nubladoIcon;
    if (desc.includes("parcialmente nublado")) {
      return contexto === "actual" && esNoche
        ? parcialmenteNubladoNocheIcon
        : parcialmenteNubladoIcon;
    }
    if (desc.includes("despejado") || desc.includes("soleado")) {
      return contexto === "actual" && esNoche ? moonIcon : sunIcon;
    }
    return contexto === "actual" && esNoche ? moonIcon : sunIcon;
  };

  return (
    <div className="container-fluid py-3">
      <div className="grid-expand mb-4">
        <div className="left-section">
          {climaActual && (
            <div className="card static-card p-3 bg-dark text-light">
              <form
                onSubmit={handleBuscarCiudad}
                className="d-flex gap-2 mb-3 flex-wrap"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar ciudad..."
                  value={ciudadBuscada}
                  onChange={(e) => setCiudadBuscada(e.target.value)}
                />
                <button className="btn btn-primary">Buscar</button>
              </form>
              {sugerencias.length > 0 && (
                <ul className="list-group mb-3">
                  {sugerencias.map((sug, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setCiudadBuscada(`${sug.city}, ${sug.region}`);
                        obtenerClima(`${sug.city}, ${sug.region}`);
                        setSugerencias([]);
                      }}
                    >
                      {sug.city}, {sug.region}
                    </li>
                  ))}
                </ul>
              )}
              <h2 className="text-center">
                {ubicacion}: {climaActual.temp_c}°C
              </h2>
              <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap text-center">
                <img
                  className="big-icon"
                  src={obtenerIcono(climaActual.condition.text, "actual")}
                  alt="clima"
                  width="100"
                  height="100"
                  loading="lazy"
                />
                <div>
                  <p>{climaActual.condition.text}</p>
                  <p>🌡 Sensación: {climaActual.feelslike_c}°C</p>
                  <p>💧 Humedad: {climaActual.humidity}%</p>
                  <p>🌬 Viento: {climaActual.wind_kph} km/h</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="right-section">
          {dolar && (
            <div className="card static-card p-3 bg-dark text-light h-100 text-center">
              <h4 className="mb-3">💵 Cotización Dólar</h4>
              <div className="mb-3">
                <h5>Dólar Blue</h5>
                <p>
                  Compra: {dolar.blue.value_buy} | Venta:{" "}
                  {dolar.blue.value_sell}
                </p>
              </div>
              <div>
                <h5>Dólar Oficial</h5>
                <p>
                  Compra: {dolar.oficial.value_buy} | Venta:{" "}
                  {dolar.oficial.value_sell}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {pronostico.length > 0 && (
        <div className="card static-card p-3 mb-4 bg-dark text-light">
          <h3 className="text-center">📅 Pronóstico semanal</h3>
          <div className="section-pronostico">
            {pronostico.map((dia, idx) => (
              <div key={idx} className="forecast-card text-center">
                <p>
                  {new Date(dia.date).toLocaleDateString("es-ES", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <img
                  src={obtenerIcono(dia.day.condition.text)}
                  alt="clima"
                  width="64"
                  height="64"
                  loading="lazy"
                  style={{ display: "block", margin: "0 auto" }}
                />
                <p>{dia.day.condition.text}</p>
                <p>☀️ Max: {dia.day.maxtemp_c}°C</p>
                <p>❄️ Min: {dia.day.mintemp_c}°C</p>
                <p>💧 {dia.day.daily_chance_of_rain}% lluvia</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pronostico.length > 0 && (
        <div className="card static-card p-3 bg-dark text-light w-100 d-none d-md-block">
          <WeatherTrendChart forecast={pronostico} />
        </div>
      )}
    </div>
  );
};

export default DatosInfo;
