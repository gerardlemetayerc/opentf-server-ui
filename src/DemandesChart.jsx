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
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Données fictives pour le nombre de demandes par jour
const data = {
  labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  datasets: [
    {
      label: "Demandes d'instances",
      data: [2, 4, 3, 6, 5, 1, 3],
      fill: false,
      borderColor: "#0d6efd",
      backgroundColor: "#0d6efd",
      tension: 0.3
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

export default function DemandesChart() {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Demandes d'instances par jour</h5>
        <div style={{ height: 260 }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
