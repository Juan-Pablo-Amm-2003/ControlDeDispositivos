from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime

# ✅ Cargar el archivo .env al inicio
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception(f"Faltan variables de entorno. URL: {SUPABASE_URL}, KEY: {SUPABASE_KEY}")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def upsert_dispositivos(dispositivos):
    """
    Inserta o actualiza dispositivos en Supabase.
    Ahora con logs para verificar exactamente qué datos se envían.
    """
    print(f"📌 Subiendo {len(dispositivos)} dispositivos a Supabase...")
    if len(dispositivos) > 0:
        print("🔍 Ejemplo de dispositivo a insertar:", dispositivos[0])

    try:
        data = supabase.table("control_dispositivos").upsert(
            dispositivos, on_conflict="codigo"
        ).execute()
        print(f"✅ Insertados/actualizados: {len(data.data)} registros en Supabase")
        return data.data
    except Exception as e:
        print("❌ ERROR subiendo dispositivos a Supabase:", e)
        raise


def obtener_dispositivos():
    """
    Obtiene todos los dispositivos desde Supabase.
    Loguea cuántos registros hay y muestra un ejemplo.
    """
    data = supabase.table("control_dispositivos").select("*").execute()
    print(f"📌 Total de dispositivos en Supabase: {len(data.data)}")
    if len(data.data) > 0:
        print("🔍 Ejemplo de dispositivo:", data.data[0])
    return data.data


def obtener_indicadores():
    dispositivos = obtener_dispositivos()

    # ✅ Cumplimiento (CUMPLE vs NO CUMPLE)
    cumplimiento = []
    for estado in ["CUMPLE", "NO CUMPLE"]:
        count = len([d for d in dispositivos if d.get("estado") == estado])
        cumplimiento.append({"estado": estado, "value": count})

    # ✅ Promedios por Planta
    plantas = {}
    for d in dispositivos:
        planta = d.get("planta")
        dias = d.get("dias_fabricacion") or 0
        if planta not in plantas:
            plantas[planta] = []
        plantas[planta].append(dias)
    promedios = [
        {"planta": p, "promedio": round(sum(vals) / len(vals), 2)}
        for p, vals in plantas.items() if vals
    ]

    # ✅ Dispositivos por Planta
    plantas_pedidos = {}
    for d in dispositivos:
        planta = d.get("planta")
        plantas_pedidos[planta] = plantas_pedidos.get(planta, 0) + 1
    evolucion = [{"fecha": planta, "pedidos": count} for planta, count in plantas_pedidos.items()]

    # ✅ Dispositivos por tipo
    tipos = {}
    for d in dispositivos:
        tipo = d.get("tipo_dispositivo") or "Sin especificar"
        tipo = tipo.strip().title()  # 👈 Normaliza (quita espacios y pone primera letra en mayúscula)
        tipos[tipo] = tipos.get(tipo, 0) + 1

    tipos_dispositivo = sorted(
        [{"tipo": t, "cantidad": c} for t, c in tipos.items()],
        key=lambda x: x["cantidad"],
        reverse=True  # 👈 Mayor a menor
)
    # ✅ Pedidos por mes
    pedidos_mensuales = {}
    for d in dispositivos:
        fecha_pedido = d.get("fecha_pedido")
        fecha_terminacion = d.get("fecha_terminacion")

        def mes(fecha):
            try:
                return datetime.strptime(fecha, "%Y-%m-%d").strftime("%Y-%m")
            except:
                return None

        mes_ped = mes(fecha_pedido)
        mes_term = mes(fecha_terminacion)

        if mes_ped:
            pedidos_mensuales.setdefault(mes_ped, {"pedidos": 0, "terminados": 0})
            pedidos_mensuales[mes_ped]["pedidos"] += 1

        if mes_term:
            pedidos_mensuales.setdefault(mes_term, {"pedidos": 0, "terminados": 0})
            pedidos_mensuales[mes_term]["terminados"] += 1

        pedidos_por_mes = sorted(
            [
                {"mes": mes, "pedidos": data["pedidos"], "terminados": data["terminados"]}
                for mes, data in pedidos_mensuales.items()
            ],
            key=lambda x: x["mes"]  # ✅ ordena de menor a mayor (YYYY-MM)
        )


            # ✅ Promedio general de tiempos por etapa
    total_dispositivos = len(dispositivos) or 1

    promedio_etapas = [
        {
            "etapa": "Diseño",
            "promedio_dias": round(
                sum(d.get("dias_diseno") or 0 for d in dispositivos) / total_dispositivos, 2
            ),
        },
        {
            "etapa": "Fabricación",
            "promedio_dias": round(
                sum(d.get("dias_fabricacion") or 0 for d in dispositivos) / total_dispositivos, 2
            ),
        },
        {
            "etapa": "Respuesta Pedido",
            "promedio_dias": round(
                sum(d.get("dias_respuesta_pedido") or 0 for d in dispositivos)
                / total_dispositivos,
                2,
            ),
        },
    ]


    print("📌 Indicadores calculados:")
    print("   - Cumplimiento:", cumplimiento)
    print("   - Promedios por planta:", promedios)
    print("   - Dispositivos por planta:", evolucion)
    print("   - Dispositivos por tipo:", tipos_dispositivo)
    print("   - Pedidos por mes:", pedidos_por_mes)
    print("promedio_etapas", promedio_etapas)

    return {
        "cumplimiento": cumplimiento,
        "promedios": promedios,
        "evolucion": evolucion,
        "tipos_dispositivo": tipos_dispositivo,
        "pedidos_por_mes": pedidos_por_mes,
        "promedio_etapas": promedio_etapas 
    }
