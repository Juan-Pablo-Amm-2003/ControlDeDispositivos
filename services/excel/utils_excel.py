import numpy as np
import pandas as pd

def limpiar_y_transformar_df(df: pd.DataFrame) -> list:
    df.columns = [col.strip() for col in df.columns]

    columnas = [
        "Código", "Descripción", "Planta",
        "Tipo de dispositivo", "Días de diseño",
        "Días de fabricación", "Días de respuesta del pedido",
        "Días de entrega", 
        "Estado", "Fecha pedido", "Fecha de terminación"
    ]

    # ✅ Mapear solo las que existan en el archivo
    mapping_existente = {}
    for c in columnas:
        col_match = [col for col in df.columns if col.startswith(c)]
        if col_match:
            mapping_existente[c] = col_match[0]
        else:
            df[c] = None
            mapping_existente[c] = c

    # ✅ Reordenar columnas
    df = df[[mapping_existente[c] for c in columnas]]

    # ✅ Renombrar → coincide con los nombres en Supabase
    df = df.rename(columns={
        mapping_existente["Código"]: "codigo",
        mapping_existente["Descripción"]: "descripcion",
        mapping_existente["Planta"]: "planta",
        mapping_existente["Tipo de dispositivo"]: "tipo_dispositivo",
        mapping_existente["Días de diseño"]: "dias_diseno",
        mapping_existente["Días de fabricación"]: "dias_fabricacion",
        mapping_existente["Días de respuesta del pedido"]: "dias_respuesta_pedido",
        mapping_existente["Días de entrega"]: "dias_entrega",  # ✅ NUEVO
        mapping_existente["Estado"]: "estado",
        mapping_existente["Fecha pedido"]: "fecha_pedido",
        mapping_existente["Fecha de terminación"]: "fecha_terminacion"
    })

    # ✅ Normalizar fechas
    for col in ["fecha_pedido", "fecha_terminacion"]:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce", dayfirst=True).dt.strftime("%Y-%m-%d")
            df[col] = df[col].where(pd.notnull(df[col]), None)

    # ✅ Reemplazar valores problemáticos
    df = df.replace([np.inf, -np.inf], np.nan).where(pd.notnull(df), None)

    # ✅ Calcular dias_entrega si no viene en el Excel
    if "dias_entrega" in df.columns:
        df["dias_entrega"] = df["dias_entrega"].apply(
            lambda x: x if x not in [None, "", "-"] else None
        )

    if "dias_entrega" in df.columns and df["dias_entrega"].isnull().all():
        if "fecha_pedido" in df.columns and "fecha_terminacion" in df.columns:
            df["dias_entrega"] = (
                pd.to_datetime(df["fecha_terminacion"], errors="coerce")
                - pd.to_datetime(df["fecha_pedido"], errors="coerce")
            ).dt.days

            # ✅ Si el cálculo es inválido o negativo → None
            df["dias_entrega"] = df["dias_entrega"].apply(
                lambda x: int(x) if pd.notna(x) and x >= 0 else None
            )

    # ✅ Filtrar y limpiar
    df = df[df["codigo"].notnull() & (df["codigo"] != "")]
    df = df.drop_duplicates(subset=["codigo"], keep="last")

    def limpiar_valor(v):
        if v is None or (isinstance(v, float) and (pd.isna(v) or np.isnan(v))):
            return None
        if isinstance(v, (np.int64, int)):
            return int(v)
        if isinstance(v, (np.float64, float)):
            return int(v) if v.is_integer() else float(v)
        return v

    return [{k: limpiar_valor(v) for k, v in row.items()} for row in df.to_dict(orient="records")]
