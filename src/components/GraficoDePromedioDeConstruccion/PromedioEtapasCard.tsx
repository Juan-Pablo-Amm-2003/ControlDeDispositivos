import React, { useState } from "react";
import PromedioEtapasBarChart from "./PromedioEtapasBarChart";

interface PromedioEtapas {
  etapa: string;
  promedio_dias: number;
}

export default function PromedioEtapasCard({ data }: { data: PromedioEtapas[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ Mini-card */}
      <div
        className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
        onClick={() => setOpen(true)}
      >
        <h3 className="text-lg font-semibold mb-2 text-center">
          Promedio de Tiempos por Etapa
        </h3>
        <div className="w-full flex justify-center">
          <PromedioEtapasBarChart data={data} height={280} />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          (Click para ampliar)
        </p>
      </div>

      {/* ✅ Modal ampliado */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[95%] lg:w-[90%] xl:w-[80%] h-[85%] flex flex-col relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
              Promedio de Tiempos por Etapa - Vista Ampliada
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <div className="w-full max-w-[1200px] h-full flex justify-center items-center">
                <PromedioEtapasBarChart data={data} height={650} />
              </div>
            </div>
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={() => setOpen(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
