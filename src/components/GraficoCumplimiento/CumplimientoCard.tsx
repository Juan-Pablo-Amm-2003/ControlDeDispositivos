import React, { useState } from "react";
import CumplimientoPieChart from "./CumplimientoPieChart";

export default function CumplimientoCard({
  data,
}: {
  data: { estado: string; value: number }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ✅ Card resumida y uniforme */}
      <div
        className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
        onClick={() => setOpen(true)}
      >
        <h3 className="text-lg font-semibold mb-2 text-center">Cumplimiento</h3>
        <CumplimientoPieChart data={data} />
        <p className="text-xs text-gray-500 text-center mt-1">
          (Click para ampliar)
        </p>
      </div>

      {/* ✅ Modal ampliado y perfectamente centrado */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] md:w-[70%] lg:w-[50%] h-[80%] flex flex-col relative animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
              Cumplimiento - Vista Ampliada
            </h2>
            <div className="flex-grow flex justify-center items-center">
              <CumplimientoPieChart data={data} />
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
