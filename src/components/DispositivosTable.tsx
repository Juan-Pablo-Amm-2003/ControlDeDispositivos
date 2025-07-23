import React, { useState, useMemo } from "react";
import { Dispositivo } from "../pages/Dashboard";

interface DispositivosTableProps {
  dispositivos: Dispositivo[];
}

const DispositivosTable: React.FC<DispositivosTableProps> = ({ dispositivos }) => {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [plantaFilter, setPlantaFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const plantasUnicas = useMemo(
    () => [...new Set(dispositivos.map((d) => d.planta))],
    [dispositivos]
  );

  const filteredData = useMemo(() => {
    return dispositivos
      .filter((d) =>
        [d.descripcion, d.codigo].some((val) =>
          val?.toLowerCase().includes(search.toLowerCase())
        )
      )
      .filter((d) => (estadoFilter ? d.estado === estadoFilter : true))
      .filter((d) => (plantaFilter ? d.planta === plantaFilter : true));
  }, [dispositivos, search, estadoFilter, plantaFilter]);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  return (
    <div className="space-y-5">
      {/* ✅ Controles */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Buscar código o descripción..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={estadoFilter}
          onChange={(e) => {
            setEstadoFilter(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos los estados</option>
          <option value="CUMPLE">✅ CUMPLE</option>
          <option value="NO CUMPLE">❌ NO CUMPLE</option>
        </select>

        <select
          value={plantaFilter}
          onChange={(e) => {
            setPlantaFilter(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas las plantas</option>
          {plantasUnicas.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Tabla */}
      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-3 py-2 text-left">Código</th>
              <th className="px-3 py-2 text-left">Descripción</th>
              <th className="px-3 py-2 text-left">Planta</th>
              <th className="px-3 py-2 text-center">Estado</th>
              <th className="px-3 py-2 text-center">Diseño (días)</th>
              <th className="px-3 py-2 text-center">Fabricación (días)</th>
              <th className="px-3 py-2 text-center">Resp. Pedido (días)</th>
              <th className="px-3 py-2 text-center">Entrega (días)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((d, i) => (
                <tr
                  key={d.codigo}
                  className={`border-b hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-2">{d.codigo}</td>
                  <td className="px-3 py-2">{d.descripcion}</td>
                  <td className="px-3 py-2">{d.planta}</td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        d.estado === "CUMPLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.estado}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {d.dias_diseno ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {d.dias_fabricacion ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {d.dias_respuesta_pedido ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {d.dias_entrega ?? "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-gray-500 py-4 italic"
                >
                  No se encontraron dispositivos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Paginación */}
      <div className="flex justify-center items-center gap-3 mt-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Página anterior"
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          ◀
        </button>
        <span className="text-sm text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Página siguiente"
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default DispositivosTable;
