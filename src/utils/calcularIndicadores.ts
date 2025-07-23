import { Dispositivo } from "../pages/Dashboard";

/**
 * Recalcula todos los indicadores en base a los dispositivos filtrados.
 */
export function calcularIndicadores(dispositivos: Dispositivo[]) {
  // ✅ Cumplimiento (CUMPLE vs NO CUMPLE)
  const cumplimiento = ["CUMPLE", "NO CUMPLE"].map((estado) => ({
    estado,
    value: dispositivos.filter((d) => d.estado === estado).length,
  }));

  // ✅ Promedios por planta
  const plantas: Record<string, number[]> = {};
  dispositivos.forEach((d) => {
    if (!plantas[d.planta]) plantas[d.planta] = [];
    plantas[d.planta].push(d.dias_fabricacion ?? 0);
  });
  const promedios = Object.entries(plantas).map(([planta, vals]) => ({
    planta,
    promedio: +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
  }));

  // ✅ Evolución (dispositivos por planta)
  const plantasPedidos: Record<string, number> = {};
  dispositivos.forEach((d) => {
    plantasPedidos[d.planta] = (plantasPedidos[d.planta] ?? 0) + 1;
  });
  const evolucion = Object.entries(plantasPedidos).map(([fecha, pedidos]) => ({
    fecha,
    pedidos,
  }));

  // ✅ Tipos de dispositivo
  const tipos: Record<string, number> = {};
  dispositivos.forEach((d) => {
    const tipo = (d as any).tipo_dispositivo ?? "Sin especificar";
    tipos[tipo.trim()] = (tipos[tipo.trim()] ?? 0) + 1;
  });
  const tipos_dispositivo = Object.entries(tipos)
    .map(([tipo, cantidad]) => ({ tipo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  // ✅ Pedidos por mes
  const pedidos: Record<string, { pedidos: number; terminados: number }> = {};
  dispositivos.forEach((d) => {
    const mes =
      d.fecha_pedido && new Date(d.fecha_pedido).toISOString().slice(0, 7);
    if (!mes) return;
    pedidos[mes] = pedidos[mes] || { pedidos: 0, terminados: 0 };
    pedidos[mes].pedidos++;
    if (d.estado === "CUMPLE") pedidos[mes].terminados++;
  });
  const pedidos_por_mes = Object.entries(pedidos)
    .map(([mes, datos]) => ({ mes, ...datos }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  // ✅ Promedio etapas
  const total = dispositivos.length || 1;
  const promedio_etapas = [
    {
      etapa: "Diseño",
      promedio_dias:
        dispositivos.reduce((a, d) => a + (d.dias_diseno ?? 0), 0) / total,
    },
    {
      etapa: "Fabricación",
      promedio_dias:
        dispositivos.reduce((a, d) => a + (d.dias_fabricacion ?? 0), 0) / total,
    },
    {
      etapa: "Respuesta Pedido",
      promedio_dias:
        dispositivos.reduce((a, d) => a + (d.dias_respuesta_pedido ?? 0), 0) /
        total,
    },
  ];

  return {
    cumplimiento,
    promedios,
    evolucion,
    tipos_dispositivo,
    pedidos_por_mes,
    promedio_etapas,
  };
}
