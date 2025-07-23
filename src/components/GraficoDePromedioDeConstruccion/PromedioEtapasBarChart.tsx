import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Cell,
} from "recharts";

interface PromedioEtapas {
  etapa: string;
  promedio_dias: number;
}

export default function PromedioEtapasBarChart({
  data,
  height = 300,
}: {
  data: PromedioEtapas[];
  height?: number;
}) {
  const getColor = (etapa: string) => {
    switch (etapa) {
      case "Diseño":
        return "#3b82f6"; // Azul
      case "Fabricación":
        return "#22c55e"; // Verde
      case "Respuesta Pedido":
        return "#f59e0b"; // Amarillo
      default:
        return "#9ca3af"; // Gris
    }
  };

  return (
    <div className="flex flex-col items-center w-full" style={{ height }}>
      <ResponsiveContainer width="95%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 30, right: 30, left: 30, bottom: 40 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="etapa" tick={{ fontSize: 12, fill: "#374151" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#374151" }}
            label={{
              value: "Promedio (días)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [`${value} días`, "Etapa"]}
          />
          <Bar dataKey="promedio_dias" radius={[6, 6, 0, 0]} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.etapa)} />
            ))}
            <LabelList
              dataKey="promedio_dias"
              position="top"
              style={{ fill: "#111827", fontSize: 12, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
