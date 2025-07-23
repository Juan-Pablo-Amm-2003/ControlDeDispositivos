import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CumplimientoPieChart({
  data,
}: {
  data: { estado: string; value: number }[];
}) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const cumple = data.find((d) => d.estado === "CUMPLE")?.value || 0;
  const porcentaje = total > 0 ? ((cumple / total) * 100).toFixed(1) : "0";

  const COLORS: Record<string, string> = {
    CUMPLE: "#22c55e",      // Verde
    "NO CUMPLE": "#ef4444", // Rojo
  };

  const orderedData = [
    { estado: "CUMPLE", value: cumple },
    { estado: "NO CUMPLE", value: total - cumple },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-56">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={orderedData}
              dataKey="value"
              nameKey="estado"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              labelLine={false}
            >
              {orderedData.map((d, i) => (
                <Cell
                  key={i}
                  fill={COLORS[d.estado]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} dispositivos (${((Number(value) / total) * 100).toFixed(
                  1
                )}%)`,
                name,
              ]}
            />
            {/* ✅ Porcentaje Central */}
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="22"
              fontWeight="bold"
              fill={
                parseFloat(porcentaje) >= 80
                  ? "#22c55e"
                  : parseFloat(porcentaje) >= 60
                  ? "#f59e0b"
                  : "#ef4444"
              }
            >
              {porcentaje}%
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="13"
              fill="#6b7280"
            >
              {`${cumple} / ${total}`}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Leyenda debajo del gráfico */}
      <div className="flex justify-center gap-6 mt-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-gray-700">
            CUMPLE {((cumple / total) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="text-gray-700">
            NO CUMPLE {(((total - cumple) / total) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
