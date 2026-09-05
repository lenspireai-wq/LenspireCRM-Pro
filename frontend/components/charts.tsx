"use client";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions as BaseChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip);

const baseLineOptions: BaseChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#cbd5e1" } },
    tooltip: { backgroundColor: "#0f172a", borderColor: "#1e293b", borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
    y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" }, beginAtZero: true },
  },
};

const baseBarOptions: BaseChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#cbd5e1" } },
    tooltip: { backgroundColor: "#0f172a", borderColor: "#1e293b", borderWidth: 1 },
  },
  scales: {
    x: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" } },
    y: { ticks: { color: "#94a3b8" }, grid: { color: "rgba(148,163,184,0.08)" }, beginAtZero: true },
  },
};

export function RevenueLineChart({ labels, gross, net }: { labels: string[]; gross: number[]; net: number[] }) {
  const data = {
    labels,
    datasets: [
      { label: "Gross", data: gross, borderColor: "#7367f0", backgroundColor: "rgba(115,103,240,0.15)", fill: true, tension: 0.3, pointRadius: 3 },
      { label: "Net", data: net, borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.12)", fill: true, tension: 0.3, pointRadius: 3 },
    ],
  };
  return <Line data={data} options={baseLineOptions} />;
}

export function FunnelDoughnut({ rows }: { rows: { status: string; count: number }[] }) {
  const palette: Record<string, string> = {
    New: "#0ea5e9",
    "Follow-up": "#f59e0b",
    Confirmed: "#22c55e",
    Booked: "#7367f0",
    Lost: "#ef4444",
  };
  const data = {
    labels: rows.map((row) => row.status),
    datasets: [
      {
        data: rows.map((row) => row.count),
        backgroundColor: rows.map((row) => palette[row.status] || "#64748b"),
        borderColor: "#0f172a",
        borderWidth: 2,
      },
    ],
  };
  const options: BaseChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "right", labels: { color: "#cbd5e1" } } },
    cutout: "62%",
  };
  return <Doughnut data={data} options={options} />;
}

export function CategoryBar({ labels, values, label, color = "#7367f0" }: { labels: string[]; values: number[]; label: string; color?: string }) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };
  return <Bar data={data} options={baseBarOptions} />;
}
