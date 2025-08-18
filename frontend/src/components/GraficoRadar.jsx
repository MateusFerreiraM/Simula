// src/components/GraficoRadar.jsx

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra os componentes necessários do Chart.js para um gráfico de radar
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function GraficoRadar({ dadosDoGrafico, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Vamos omitir a legenda para um visual mais limpo
      },
      title: {
        display: true,
        text: title, // Usaremos um título dinâmico
      },
    },
    scales: {
      r: { // 'r' é o eixo radial (os valores)
        beginAtZero: true,
        max: 100,
        ticks: {
            display: false, // Esconde os números do eixo para um visual mais limpo
        }
      }
    }
  };

  return <Radar options={options} data={dadosDoGrafico} />;
}

export default GraficoRadar;