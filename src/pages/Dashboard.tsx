// ✅ Dashboard.tsx COMPLETO con mejoras en título PDF y altura de gráfico PromedioEtapasCard
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";

import {
  getDispositivos,
  getIndicadores,
  uploadExcel,
} from "../services/api";

import FileUpload from "../components/FileUpload";
import DispositivosTable from "../components/DispositivosTable";
import CumplimientoCard from "../components/GraficoCumplimiento/CumplimientoCard";
import PromedioCard from "../components/GraficoDePromedioPorPlanta/PromedioCard";
import DispositivosPorPlantaCard from "../components/GraficoDispositivosPorPlanta/DispositivosPorPlantaCard";
import TiposDispositivoCard from "../components/GraficoDeDispositivosPorTipo/TiposDispositivoCard";
import PedidosPorMesCard from "../components/GraficoDeDispositivoPorMes/PedidosPorMesCard";
import PromedioEtapasCard from "../components/GraficoDePromedioDeConstruccion/PromedioEtapasCard";

import IndicadoresFiltro, { TipoPeriodo } from "../components/Filtros/IndicadoresFiltro";
import { filtrarPorPeriodo } from "../utils/filtrarPorPeriodo";
import { calcularIndicadores } from "../utils/calcularIndicadores";
import { generarOpcionesPeriodo } from "../utils/generarOpcionesPeriodo";

export interface Dispositivo {
  fecha_pedido: string | number | Date;
  codigo: string;
  descripcion: string;
  planta: string;
  estado: string;
  dias_diseno?: number;
  dias_fabricacion?: number;
  dias_respuesta_pedido?: number;
  dias_entrega?: number;
}

interface Indicadores {
  cumplimiento: { estado: string; value: number }[];
  promedios: { planta: string; promedio: number }[];
  evolucion: { fecha: string; pedidos: number }[];
  tipos_dispositivo: { tipo: string; cantidad: number }[];
  pedidos_por_mes: { mes: string; pedidos: number; terminados: number }[];
  promedio_etapas: { etapa: string; promedio_dias: number }[];
}

const Dashboard: React.FC = () => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [periodo, setPeriodo] = useState<TipoPeriodo>("todos");
  const [valorPeriodo, setValorPeriodo] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dispositivosData, indicadoresData] = await Promise.all([
          getDispositivos(),
          getIndicadores(),
        ]);
        setDispositivos(dispositivosData);
        setIndicadores(indicadoresData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await uploadExcel(file);
      setUploadMessage(response.message || "Archivo subido correctamente");
      const [dispositivosData, indicadoresData] = await Promise.all([
        getDispositivos(),
        getIndicadores(),
      ]);
      setDispositivos(dispositivosData);
      setIndicadores(indicadoresData);
    } catch (error) {
      setUploadMessage("❌ Error al subir el archivo");
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (nuevoPeriodo: TipoPeriodo, nuevoValor: string) => {
    setPeriodo(nuevoPeriodo);
    setValorPeriodo(nuevoValor);
  };

  const exportarPDFConGraficos = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Reporte de Indicadores - Gestión de Cambios", 14, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    const cards = document.querySelectorAll(".indicador-card");
    for (const card of cards) {
      const canvas = await html2canvas(card as HTMLElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (y + imgHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.addImage(imgData, "PNG", 15, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    }

    doc.save(`reporte_indicadores_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportarPDFTabla = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(16);
    doc.text("📋 Listado de Dispositivos", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Código", "Descripción", "Planta", "Estado", "Diseño", "Fabricación", "Resp. Pedido", "Entrega"]],
      body: dispositivosFiltrados.map((d) => [
        d.codigo,
        d.descripcion,
        d.planta,
        d.estado,
        d.dias_diseno ?? "-",
        d.dias_fabricacion ?? "-",
        d.dias_respuesta_pedido ?? "-",
        d.dias_entrega ?? "-",
      ]),
      theme: "striped",
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 8 },
    });

    doc.save(`dispositivos_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-red-600 text-xl font-semibold mb-4">
          ⚠ Error al cargar los datos.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const dispositivosFiltrados = filtrarPorPeriodo(dispositivos, periodo, valorPeriodo);
  const indicadoresFiltrados = calcularIndicadores(dispositivosFiltrados);
  const opcionesPeriodo = generarOpcionesPeriodo(dispositivos);

  return (
    <div className="w-full mx-auto p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
        📊 Panel de Control de Dispositivos
      </h1>

      {/* ✅ Subida de Excel */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Subir nuevo archivo Excel</h2>
        <FileUpload onUpload={handleFileUpload} />
        {uploadMessage && (
          <p className="mt-2 text-sm font-medium text-blue-600">{uploadMessage}</p>
        )}
      </div>

      {/* ✅ Filtros e Indicadores */}
      <div className="space-y-6">
        <IndicadoresFiltro
          onFilterChange={handleFilterChange}
          opciones={opcionesPeriodo}
        />

        {indicadores && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-700">Indicadores</h2>
              <button
                onClick={exportarPDFConGraficos}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                📥 Descargar PDF con Gráficos
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="indicador-card">
                <CumplimientoCard data={indicadoresFiltrados.cumplimiento} />
              </div>
              <div className="indicador-card">
                <PromedioCard data={indicadoresFiltrados.promedios} />
              </div>
              <div className="indicador-card">
                <DispositivosPorPlantaCard data={indicadoresFiltrados.evolucion} />
              </div>
              <div className="indicador-card">
                <TiposDispositivoCard data={indicadoresFiltrados.tipos_dispositivo} />
              </div>
              <div className="indicador-card xl:col-span-2">
                <PedidosPorMesCard data={indicadoresFiltrados.pedidos_por_mes} />
              </div>
              <div className="indicador-card xl:col-span-2">
                <PromedioEtapasCard data={indicadoresFiltrados.promedio_etapas} height={360} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Tabla de dispositivos al final */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Listado de Dispositivos</h2>
          <button
            onClick={exportarPDFTabla}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📥 Descargar PDF de la Tabla
          </button>
        </div>
        <DispositivosTable dispositivos={dispositivosFiltrados} />
      </div>
    </div>
  );
};

export default Dashboard;