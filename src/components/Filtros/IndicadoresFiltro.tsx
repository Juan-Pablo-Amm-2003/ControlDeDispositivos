import React, { useState } from "react";

export type TipoPeriodo = "todos" | "anio" | "cuatrimestre" | "trimestre" | "mes";

interface IndicadoresFiltroProps {
  onFilterChange: (periodo: TipoPeriodo, valor: string) => void;
  opciones: { años: number[]; mesesPorAño: Record<number, number[]> };
}

const IndicadoresFiltro: React.FC<IndicadoresFiltroProps> = ({ onFilterChange, opciones }) => {
  const [periodo, setPeriodo] = useState<TipoPeriodo>("todos");
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | "">("");
  const [valor, setValor] = useState("");

  const handlePeriodoChange = (nuevoPeriodo: TipoPeriodo) => {
    setPeriodo(nuevoPeriodo);
    setAnioSeleccionado("");
    setValor("");
    onFilterChange(nuevoPeriodo, "");
  };

  const handleAnioChange = (nuevoAnio: number) => {
    setAnioSeleccionado(nuevoAnio);
    setValor("");
    onFilterChange(periodo, nuevoAnio.toString());
  };

  const handleValorChange = (nuevoValor: string) => {
    setValor(nuevoValor);
    let valorFinal = "";

    if (periodo === "anio") {
      valorFinal = anioSeleccionado.toString();
    } else if (periodo === "mes") {
      valorFinal = `${anioSeleccionado}-${nuevoValor}`;
    } else if (periodo === "trimestre" || periodo === "cuatrimestre") {
      // Guardamos año-mes como referencia
      valorFinal = `${anioSeleccionado}-${nuevoValor}`;
    }
    onFilterChange(periodo, valorFinal);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">Filtrar Indicadores por Período</h3>
      <div className="flex flex-wrap gap-3">
        {/* Selector de período */}
        <select
          value={periodo}
          onChange={(e) => handlePeriodoChange(e.target.value as TipoPeriodo)}
          className="border p-2 rounded"
        >
          <option value="todos">Todos</option>
          <option value="anio">Por Año</option>
          <option value="cuatrimestre">Por Cuatrimestre</option>
          <option value="trimestre">Por Trimestre</option>
          <option value="mes">Por Mes</option>
        </select>

        {/* Años disponibles */}
        {periodo !== "todos" && (
          <select
            value={anioSeleccionado}
            onChange={(e) => handleAnioChange(parseInt(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="">Seleccione año</option>
            {opciones.años.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}

        {/* Opciones dinámicas según período */}
        {periodo === "mes" && anioSeleccionado && (
          <select
            value={valor}
            onChange={(e) => handleValorChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccione mes</option>
            {opciones.mesesPorAño[anioSeleccionado]?.map((m) => (
              <option key={m} value={String(m).padStart(2, "0")}>
                {new Date(0, m - 1).toLocaleString("es-ES", { month: "long" })}
              </option>
            ))}
          </select>
        )}

        {periodo === "trimestre" && anioSeleccionado && (
          <select
            value={valor}
            onChange={(e) => handleValorChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccione trimestre</option>
            <option value="01">Primer trimestre</option>
            <option value="04">Segundo trimestre</option>
            <option value="07">Tercer trimestre</option>
            <option value="10">Cuarto trimestre</option>
          </select>
        )}

        {periodo === "cuatrimestre" && anioSeleccionado && (
          <select
            value={valor}
            onChange={(e) => handleValorChange(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccione cuatrimestre</option>
            <option value="01">Primer cuatrimestre</option>
            <option value="05">Segundo cuatrimestre</option>
            <option value="09">Tercer cuatrimestre</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default IndicadoresFiltro;
