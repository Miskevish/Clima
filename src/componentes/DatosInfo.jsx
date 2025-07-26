import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";

const WeatherTrendChart = lazy(() => import("./WeatherTrendChart"));

import sunIcon from "../assets/weather-icons/sun.png";
import moonIcon from "../assets/weather-icons/moon.png";
import lluviaLigeraIcon from "../assets/weather-icons/lluvia-ligera.png";
import lluviaIntensaIcon from "../assets/weather-icons/lluvia-intensa.png";
import lloviznaIcon from "../assets/weather-icons/llovizna.png";
import stormIcon from "../assets/weather-icons/storm.png";
import parcialmenteNubladoIcon from "../assets/weather-icons/parcialmente-nublado.png";
import parcialmenteNubladoNocheIcon from "../assets/weather-icons/parcialmente-nublado-noche.png";
import nubladoIcon from "../assets/weather-icons/nublado.png";

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
      console.warn("⚠️ Error obteniendo sugerencias (posible límite API)", err);
    }
  };

  const obtenerClima = async (ciudad) => {
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${ciudad}&days=7&lang=es`
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
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          obtenerClima(`${lat},${lon}`);
        },
        () => console.log("Geolocalización rechazada, usando Buenos Aires")
      );
    }

    obtenerDolar();
  }, []);

  useEffect(() => {
    if (!ciudadBuscada.trim()) {
      setSugerencias([]);
      return;
    }
    const delay = setTimeout(() => obtenerSugerencias(ciudadBuscada), 500);
    return () => clearTimeout(delay);
  }, [ciudadBuscada]);

  const obtenerIcono = (condicion) => {
    const desc = condicion.toLowerCase();

    if (desc.includes("tormenta")) return stormIcon;
    if (desc.includes("lluvia intensa")) return lluviaIntensaIcon;
    if (desc.includes("lluvia moderada")) return lluviaLigeraIcon;
    if (desc.includes("llovizna")) return lloviznaIcon;
    if (desc.includes("lluvia")) return lluviaLigeraIcon;

    if (desc.includes("parcialmente nublado")) {
      const hora = new Date().getHours();
      const esNoche = hora >= 19 || hora < 6;
      return esNoche ? parcialmenteNubladoNocheIcon : parcialmenteNubladoIcon;
    }
    if (desc.includes("nublado")) return nubladoIcon;

    const hora = new Date().getHours();
    const esNoche = hora >= 19 || hora < 6;
    if (esNoche || desc.includes("noche") || desc.includes("luna")) {
      return moonIcon;
    }

    return sunIcon;
  };

  return (
    <div className="clean-layout fade-in">
      <div className="content-layout">
        <div className="main-section">
          {climaActual && (
            <div className="current-weather highlight-card">
              <div className="search-container">
                <form onSubmit={handleBuscarCiudad} className="search-inline">
                  <input
                    type="text"
                    placeholder="Buscar ciudad..."
                    value={ciudadBuscada}
                    onChange={(e) => setCiudadBuscada(e.target.value)}
                  />
                  <button type="submit">Buscar</button>
                </form>

                {sugerencias.length > 0 && (
                  <ul className="suggestions">
                    {sugerencias.map((sug, idx) => (
                      <li
                        key={idx}
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
              </div>

              <h2>
                {ubicacion}: {climaActual.temp_c}°C
              </h2>
              <div className="current-weather-body">
                <img
                  className="big-icon"
                  src={obtenerIcono(climaActual.condition.text)}
                  alt={climaActual.condition.text}
                  width="80"
                  height="80"
                  loading="lazy"
                />
                <div className="weather-details">
                  <p>{climaActual.condition.text}</p>
                  <p>🌡 Sensación térmica: {climaActual.feelslike_c}°C</p>
                  <p>💧 Humedad: {climaActual.humidity}%</p>
                  <p>🌬 Viento: {climaActual.wind_kph} km/h</p>
                </div>
              </div>
            </div>
          )}

          {pronostico.length > 0 && (
            <div className="forecast highlight-card">
              <h3>📅 Pronóstico semanal</h3>
              <div className="forecast-grid">
                {pronostico.map((dia, idx) => (
                  <div key={idx} className="forecast-card">
                    <p className="forecast-day">
                      {new Date(dia.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <img
                      src={obtenerIcono(dia.day.condition.text)}
                      alt={dia.day.condition.text}
                      width="64"
                      height="64"
                      loading="lazy"
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

          {/* ✅ Lazy load solo cuando hay pronóstico */}
          {pronostico.length > 0 && (
            <div className="highlight-card">
              <Suspense
                fallback={
                  <p style={{ color: "white" }}>⏳ Cargando gráfico...</p>
                }
              >
                <WeatherTrendChart forecast={pronostico} />
              </Suspense>
            </div>
          )}
        </div>

        <aside className="sidebar">
          {dolar && (
            <div className="dollar-cards">
              <div className="dollar-card">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
                  alt="blue"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div>
                  <h4>Dólar Blue</h4>
                  <p>
                    Compra: {dolar.blue.value_buy} | Venta:{" "}
                    {dolar.blue.value_sell}
                  </p>
                </div>
              </div>

              <div className="dollar-card">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3443/3443338.png"
                  alt="oficial"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div>
                  <h4>Dólar Oficial</h4>
                  <p>
                    Compra: {dolar.oficial.value_buy} | Venta:{" "}
                    {dolar.oficial.value_sell}
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DatosInfo;
