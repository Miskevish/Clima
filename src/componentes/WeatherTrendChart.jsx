import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherTrendChart = ({ forecast }) => {
  const labels = forecast.map((day) =>
    new Date(day.date).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    })
  );

  const maxTemps = forecast.map((day) => day.day.maxtemp_c);
  const minTemps = forecast.map((day) => day.day.mintemp_c);

  const data = {
    labels,
    datasets: [
      {
        label: "🌞 Máxima °C",
        data: maxTemps,
        borderColor: "#ff9800",
        backgroundColor: "rgba(255, 152, 0, 0.3)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "❄️ Mínima °C",
        data: minTemps,
        borderColor: "#03a9f4",
        backgroundColor: "rgba(3, 169, 244, 0.3)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "📊 Tendencia semanal de temperatura",
        color: "#fff",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="trend-chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherTrendChart;
