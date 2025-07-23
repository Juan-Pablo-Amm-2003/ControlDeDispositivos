import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  Cell,
} from "recharts";

interface PromedioData {
  planta: string;
  promedio: number;
}

export default function PromedioDiasBarChart({
  data,
}: {
  data: PromedioData[];
}) {
  const getColor = (valor: number) => {
    if (valor <= 5) return "#22c55e"; // Verde
    if (valor <= 10) return "#f59e0b"; // Amarillo
    return "#ef4444"; // Rojo
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ✅ Gráfico perfectamente centrado */}
      <div className="w-[95%] md:w-[80%] lg:w-[70%] h-72 flex justify-center">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 30, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="planta"
              tick={{ fontSize: 12, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#374151" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
              formatter={(value: number, name, props) => [
                `${value} días en promedio`,
                `Planta: ${props.payload.planta}`,
              ]}
            />
            <Bar dataKey="promedio" radius={[8, 8, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(entry.promedio)}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
              <LabelList
                dataKey="promedio"
                position="top"
                style={{
                  fill: "#111827",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Leyenda centrada */}
      <div className="flex justify-center gap-6 mt-3 text-sm">
      </div>
    </div>
  );
}
