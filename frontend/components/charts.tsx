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
import { useTheme } from "@/components/ThemeToggle";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip);

function useCartesianOptions(): BaseChartOptions<"line"> {
  const { theme } = useTheme();
  const text = theme === "light" ? "#696780" : "#bcb1a1";
  const grid = theme === "light" ? "#eee9f3" : "#40392f";
  return {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: text, usePointStyle: true, boxWidth: 8 } },
    tooltip: { backgroundColor: "#262320", borderColor: "#665238", borderWidth: 1, titleColor: "#f4eee4", bodyColor: "#f4eee4" },
  },
  scales: {
    x: { ticks: { color: text }, grid: { color: grid } },
    y: { ticks: { color: text }, grid: { color: grid }, beginAtZero: true },
  },
  };
}

export function RevenueLineChart({ labels, gross, net }: { labels: string[]; gross: number[]; net: number[] }) {
  const options = useCartesianOptions();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const data = {
    labels,
    datasets: [
      { label: "Gross", data: gross, borderColor: dark ? "#d4b477" : "#7367f0", backgroundColor: dark ? "rgba(212,180,119,0.12)" : "rgba(115,103,240,0.15)", fill: true, tension: 0.3, pointRadius: 3 },
      { label: "Net", data: net, borderColor: dark ? "#a9ba86" : "#22c55e", backgroundColor: dark ? "rgba(169,186,134,0.08)" : "rgba(34,197,94,0.12)", fill: true, tension: 0.3, pointRadius: 3 },
    ],
  };
  return <Line data={data} options={options} />;
}

export function FunnelDoughnut({ rows }: { rows: { status: string; count: number }[] }) {
  const { theme } = useTheme();
  const palette: Record<string, string> = theme === "dark" ? {
    New: "#d4b477", "Follow-up": "#c99a76", Confirmed: "#a9ba86", Booked: "#a396b5", Lost: "#c4827e",
  } : {
    New: "#a58adb",
    "Follow-up": "#edbd98",
    Confirmed: "#75be96",
    Booked: "#7650c8",
    Lost: "#dc93ac",
  };
  const data = {
    labels: rows.map((row) => row.status),
    datasets: [
      {
        data: rows.map((row) => row.count),
        backgroundColor: rows.map((row) => palette[row.status] || "#64748b"),
        borderColor: theme === "light" ? "#fffefd" : "#262320",
        borderWidth: 2,
      },
    ],
  };
  const options: BaseChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "right", labels: { color: theme === "light" ? "#696780" : "#bcb1a1", usePointStyle: true, boxWidth: 8 } } },
    cutout: "62%",
  };
  return <Doughnut data={data} options={options} />;
}

export function CategoryBar({ labels, values, label, color = "#7367f0" }: { labels: string[]; values: number[]; label: string; color?: string }) {
  const options = useCartesianOptions() as BaseChartOptions<"bar">;
  const { theme } = useTheme();
  const barColor = theme === "dark" ? (color === "#7367f0" ? "#d4b477" : color === "#ef4444" ? "#c4827e" : color) : color;
  const data = {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: barColor,
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };
  return <Bar data={data} options={options} />;
}
