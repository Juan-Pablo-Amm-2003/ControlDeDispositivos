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
  ReferenceLine,
} from "recharts";

interface MesData {
  mes: string;
  pedidos: number;
  terminados: number;
}

export default function PedidosPorMesBarChart({
  data,
  height = 300,
}: {
  data: MesData[];
  height?: number;
}) {
  const sortedData = [...data].sort((a, b) => a.mes.localeCompare(b.mes));

  const promedioPedidos =
    sortedData.reduce((acc, d) => acc + d.pedidos, 0) / sortedData.length || 0;
  const promedioTerminados =
    sortedData.reduce((acc, d) => acc + d.terminados, 0) /
      sortedData.length || 0;

  return (
    <div className="flex flex-col items-center w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="mes"
            angle={sortedData.length > 15 ? -30 : 0}
            textAnchor={sortedData.length > 15 ? "end" : "middle"}
            tick={{ fontSize: 12, fill: "#374151" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) => [
              `${value} dispositivos`,
              name === "pedidos"
                ? "Pedidos Solicitados"
                : "Pedidos Terminados",
            ]}
            labelFormatter={(label) => `Mes: ${label}`}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: "20px" }}
          />

          {/* ✅ Líneas de promedio suaves */}
          <ReferenceLine
            y={promedioPedidos}
            stroke="#facc15"
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            ifOverflow="extendDomain"
          />
          <ReferenceLine
            y={promedioTerminados}
            stroke="#4ade80"
            strokeDasharray="3 3"
            strokeOpacity={0.4}
            ifOverflow="extendDomain"
          />

          {/* ✅ Barras limpias y modernas */}
          <Bar
            dataKey="pedidos"
            name="Pedidos Solicitados"
            fill="#fbbf24"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          >
            <LabelList
              dataKey="pedidos"
              position="top"
              style={{ fill: "#111827", fontSize: 12, fontWeight: "bold" }}
            />
          </Bar>
          <Bar
            dataKey="terminados"
            name="Pedidos Terminados"
            fill="#22c55e"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          >
            <LabelList
              dataKey="terminados"
              position="top"
              style={{ fill: "#111827", fontSize: 12, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ✅ Promedios BI-style debajo */}
      <div className="flex justify-center gap-6 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="text-gray-700">
            Promedio Solicitados: {promedioPedidos.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span className="text-gray-700">
            Promedio Terminados: {promedioTerminados.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
