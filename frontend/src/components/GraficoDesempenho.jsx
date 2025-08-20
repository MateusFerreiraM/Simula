import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Renderiza um gráfico de barras para exibir o desempenho por matéria.
 * @param {{dadosDoGrafico: object}} props - Os dados formatados para o Chart.js.
 */
function GraficoDesempenho({ dadosDoGrafico }) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Percentual de Acerto por Matéria' },
      tooltip: {
        callbacks: {
          label: function(context) { return `Acerto: ${context.formattedValue}%`; }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) { return value + '%'; }
        }
      }
    }
  };

  return <Bar options={options} data={dadosDoGrafico} />;
}

export default GraficoDesempenho;