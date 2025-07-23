import React, { useState } from "react";
import PromedioDiasBarChart from "./PromedioDiasBarChart";

interface PromedioData {
  planta: string;
  promedio: number;
}

export default function PromedioCard({
  data,
}: {
  data: PromedioData[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ Card Resumida */}
      <div
        className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
        onClick={() => setOpen(true)}
      >
        <h3 className="text-lg font-semibold mb-2">Promedio de Días</h3>
        <PromedioDiasBarChart data={data} />
        <p className="text-xs text-gray-500 mt-1">(Click para ampliar)</p>
      </div>

      {/* ✅ Modal Centrado */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] md:w-[70%] lg:w-[60%] h-[80%] flex flex-col relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
              Promedio de Días - Vista Ampliada
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <div className="w-full h-full flex justify-center items-center">
                <PromedioDiasBarChart data={data} />
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
