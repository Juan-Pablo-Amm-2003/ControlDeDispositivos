import { Dispositivo } from "../pages/Dashboard";

/**
 * Genera listas de años y meses existentes en base a los dispositivos cargados
 */
export function generarOpcionesPeriodo(dispositivos: Dispositivo[]) {
  const fechas = dispositivos
    .map((d) => (d.fecha_pedido ? new Date(d.fecha_pedido) : null))
    .filter((f): f is Date => f !== null);

  const años = [...new Set(fechas.map((f) => f.getFullYear()))].sort();

  const mesesPorAño: Record<number, number[]> = {};
  fechas.forEach((f) => {
    const y = f.getFullYear();
    if (!mesesPorAño[y]) mesesPorAño[y] = [];
    const mes = f.getMonth() + 1;
    if (!mesesPorAño[y].includes(mes)) {
      mesesPorAño[y].push(mes);
    }
  });

  // Ordenar meses de menor a mayor
  Object.keys(mesesPorAño).forEach((a) => {
    mesesPorAño[parseInt(a)] = mesesPorAño[parseInt(a)].sort((a, b) => a - b);
  });

  return { años, mesesPorAño };
}
