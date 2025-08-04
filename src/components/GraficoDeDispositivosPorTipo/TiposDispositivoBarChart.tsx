import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  CartesianGrid,
  Cell,
} from "recharts";

interface TipoData {
  tipo: string;
  cantidad: number;
}

export default function TiposDispositivoBarChart({
  data,
  height = 300,
  showLegend = true,
  modoExportacionPDF = false,
}: {
  data: TipoData[];
  height?: number;
  showLegend?: boolean;
  modoExportacionPDF?: boolean;
}) {
  // 🔁 Ordenamiento: por tipo si es para exportación, por cantidad en el dashboard
  const sortedData = modoExportacionPDF
    ? [...data].sort((a, b) => a.tipo.localeCompare(b.tipo))
    : [...data].sort((a, b) => b.cantidad - a.cantidad);

  const total = sortedData.reduce((acc, d) => acc + d.cantidad, 0);

  const getColor = (cantidad: number) => {
    if (cantidad >= 50) return "#2563eb";
    if (cantidad >= 20) return "#3b82f6";
    return "#93c5fd";
  };

  return (
    <div className="flex flex-col items-center w-full" style={{ height }}>
      <ResponsiveContainer width="95%" height="100%">
        <BarChart
          data={sortedData}
          margin={{
            top: 30,
            right: 30,
            left: 30,
            bottom:
              modoExportacionPDF || sortedData.some((d) => d.tipo.length > 15)
                ? 100
                : sortedData.length > 8
                ? 70
                : 50,
          }}
          barCategoryGap={sortedData.length > 8 ? "15%" : "20%"}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="tipo"
            tick={{ fontSize: 10, fill: "#374151" }}
            angle={modoExportacionPDF ? -90 : sortedData.length > 8 ? -45 : 0}
            textAnchor={modoExportacionPDF ? "end" : sortedData.length > 8 ? "end" : "middle"}
            interval={0}
            height={modoExportacionPDF ? 140 : undefined}
          />
          <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value: number, name, props) => [
              `${value} dispositivos (${((value / total) * 100).toFixed(1)}%)`,
              `Tipo: ${props.payload.tipo}`,
            ]}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ marginTop: "20px" }}
            />
          )}
          <Bar
            dataKey="cantidad"
            name="Cantidad de dispositivos"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.cantidad)} />
            ))}
            <LabelList
              dataKey="cantidad"
              position="top"
              style={{
                fill: "#111827",
                fontSize: 12,
                fontWeight: "bold",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ✅ Total BI-Style debajo */}
      <div className="mt-3 text-sm text-gray-700">
        Total dispositivos: <span className="font-semibold">{total}</span>
      </div>
    </div>
  );
}
