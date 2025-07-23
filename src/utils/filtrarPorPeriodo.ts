import { Dispositivo } from "../pages/Dashboard";
import { TipoPeriodo } from "../components/Filtros/IndicadoresFiltro";

/**
 * Filtra dispositivos según el período seleccionado
 */
export function filtrarPorPeriodo(
  dispositivos: Dispositivo[],
  periodo: TipoPeriodo,
  valor: string
): Dispositivo[] {
  if (periodo === "todos" || !valor) return dispositivos;

  const fechaPedido = (d: Dispositivo) =>
    d.fecha_pedido ? new Date(d.fecha_pedido) : null;

  const year = periodo === "anio" ? parseInt(valor) : null;
  const [filtroYear, filtroMes] =
    periodo !== "anio" ? valor.split("-").map(Number) : [null, null];

  return dispositivos.filter((d) => {
    const f = fechaPedido(d);
    if (!f) return false;

    switch (periodo) {
      case "anio":
        return f.getFullYear() === year;

      case "mes":
        return (
          f.getFullYear() === filtroYear && f.getMonth() + 1 === filtroMes
        );

      case "trimestre": {
        const trimestre = Math.floor(f.getMonth() / 3) + 1;
        const filtroTrimestre = Math.floor((filtroMes! - 1) / 3) + 1;
        return f.getFullYear() === filtroYear && trimestre === filtroTrimestre;
      }

      case "cuatrimestre": {
        const cuatrimestre = Math.floor(f.getMonth() / 4) + 1;
        const filtroCuatrimestre = Math.floor((filtroMes! - 1) / 4) + 1;
        return (
          f.getFullYear() === filtroYear && cuatrimestre === filtroCuatrimestre
        );
      }

      default:
        return true;
    }
  });
}
