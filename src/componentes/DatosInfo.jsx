import React, { useState, useEffect } from "react";
import axios from "axios";

const DatosInfo = () => {
  const [climaActual, setClimaActual] = useState(null);
  const [pronostico, setPronostico] = useState([]);
  const [ciudadBuscada, setCiudadBuscada] = useState("");
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);
  const [dolar, setDolar] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

  // ✅ Obtener clima actual + pronóstico 7 días por nombre de ciudad
  const obtenerClimaYPronostico = async (ciudad) => {
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${ciudad}&days=7&lang=es`
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

  // ✅ Buscar manualmente una ciudad
  const handleBuscarCiudad = async (e) => {
    e.preventDefault();
    if (!ciudadBuscada.trim()) return;
    obtenerClimaYPronostico(ciudadBuscada);
  };

  // ✅ Obtener dólar blue y oficial
  const obtenerDolar = async () => {
    try {
      const res = await axios.get("https://api.bluelytics.com.ar/v2/latest");
      setDolar(res.data);
    } catch (err) {
      console.error("Error obteniendo dólar:", err);
    }
  };

  // ✅ Detectar ubicación actual al cargar la página
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          obtenerClimaYPronostico(`${lat},${lon}`);
        },
        () => {
          console.warn("No se pudo obtener ubicación, usando Buenos Aires");
          obtenerClimaYPronostico("Buenos Aires");
        }
      );
    } else {
      console.warn("Geolocalización no soportada. Usando Buenos Aires.");
      obtenerClimaYPronostico("Buenos Aires");
    }

    // Obtener dólar siempre
    obtenerDolar();
  }, []);

  // ✅ Formatear fecha para pronóstico
  const formatearFecha = (fecha) => {
    const opciones = { weekday: "long", day: "numeric", month: "short" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📍 Datos en tiempo real</h2>

      {/* 🔍 Buscador de ciudades */}
      <form onSubmit={handleBuscarCiudad} style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="🔍 Buscar ciudad..."
          value={ciudadBuscada}
          onChange={(e) => setCiudadBuscada(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "70%",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4a90e2",
            color: "white",
            cursor: "pointer",
          }}
        >
          Buscar
        </button>
      </form>

      {/* ⚠️ Mensaje de error */}
      {error && <p>⚠️ {error}</p>}

      {/* 🌤️ CLIMA ACTUAL */}
      {climaActual && (
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          <h3>
            🌍 {ubicacion}: {climaActual.temp_c}°C
          </h3>
          <img
            src={`https:${climaActual.condition.icon}`}
            alt="icono clima"
            style={{ width: "50px" }}
          />
          <p style={{ textTransform: "capitalize" }}>
            {climaActual.condition.text}
          </p>
          <p>🌡️ Sensación térmica: {climaActual.feelslike_c}°C</p>
          <p>💧 Humedad: {climaActual.humidity}%</p>
          <p>💨 Viento: {climaActual.wind_kph} km/h</p>
        </div>
      )}

      {/* 📅 PRONÓSTICO 7 DÍAS */}
      {pronostico.length > 0 && (
        <>
          <h3>📅 Pronóstico semanal</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "12px",
            }}
          >
            {pronostico.map((dia, idx) => (
              <div
                key={idx}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <p style={{ fontWeight: "bold" }}>{formatearFecha(dia.date)}</p>
                <img
                  src={`https:${dia.day.condition.icon}`}
                  alt="icono clima"
                  style={{ width: "50px" }}
                />
                <p style={{ textTransform: "capitalize" }}>
                  {dia.day.condition.text}
                </p>
                <p>☀️ Max: {dia.day.maxtemp_c}°C</p>
                <p>❄️ Min: {dia.day.mintemp_c}°C</p>
                <p>💧 {dia.day.daily_chance_of_rain}% lluvia</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 💵 DÓLAR BLUE + OFICIAL */}
      {dolar && (
        <div style={{ marginTop: "20px" }}>
          <h3>💵 Dólar Blue</h3>
          <p>
            Compra: {dolar.blue.value_buy} | Venta: {dolar.blue.value_sell}
          </p>

          <h3>🏦 Dólar Oficial</h3>
          <p>
            Compra: {dolar.oficial.value_buy} | Venta:{" "}
            {dolar.oficial.value_sell}
          </p>
        </div>
      )}
    </div>
  );
};

export default DatosInfo;
