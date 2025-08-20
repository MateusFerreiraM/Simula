import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * Renderiza um gráfico de radar para comparar desempenhos.
 * @param {{dadosDoGrafico: object, title: string}} props
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