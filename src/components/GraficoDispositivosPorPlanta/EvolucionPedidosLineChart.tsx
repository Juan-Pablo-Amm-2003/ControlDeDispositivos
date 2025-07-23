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

interface PlantaData {
  fecha: string; // realmente es "planta"
  pedidos: number;
}

export default function DispositivosPorPlantaBarChart({
  data,
}: {
  data: PlantaData[];
}) {
  const getColor = (cantidad: number) => {
    if (cantidad <= 30) return "#86efac"; // Verde claro
    if (cantidad <= 60) return "#22c55e"; // Verde medio
    return "#15803d"; // Verde oscuro (muchos dispositivos)
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => [
            `${value} dispositivos`,
            `Planta: ${props.payload.fecha}`,
          ]}
        />
        <Legend />
        <Bar dataKey="pedidos" name="Dispositivos">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.pedidos)} />
          ))}
          <LabelList dataKey="pedidos" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
