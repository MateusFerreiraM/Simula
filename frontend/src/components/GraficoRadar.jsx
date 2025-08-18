import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Registra os plugins necessários do Chart.js para este tipo de gráfico.
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * Renderiza um gráfico de radar para comparar desempenhos.
 * @param {{dadosDoGrafico: object, title: string}} props - Os dados e o título para o gráfico.
 */
function GraficoRadar({ dadosDoGrafico, title }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false }
      }
    }
  };

  return <Radar options={options} data={dadosDoGrafico} />;
}

export default GraficoRadar;