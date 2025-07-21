import pandas as pd
import numpy as np

def procesar_excel(upload_file):
    if upload_file.filename.endswith(".xlsx"):
        df = pd.read_excel(upload_file.file)
    else:
        df = pd.read_csv(upload_file.file, delimiter=';', encoding='latin-1')

    # Limpiar espacios en nombres de columnas
    df.columns = [col.strip() for col in df.columns]

    # Seleccionar columnas necesarias
    columnas = [
        "Código", "Descripción", "Planta",
        "Tipo de dispositivo", "Días de diseño",
        "Días de fabricación", "Días de respuesta del pedido", "Estado"
    ]
    mapping_existente = {c: [col for col in df.columns if col.startswith(c)][0] for c in columnas}
    df = df[[mapping_existente[c] for c in columnas]]

    # Renombrar columnas para coincidir con la tabla
    df = df.rename(columns={
        mapping_existente["Código"]: "codigo",
        mapping_existente["Descripción"]: "descripcion",
        mapping_existente["Planta"]: "planta",
        mapping_existente["Tipo de dispositivo"]: "tipo_dispositivo",
        mapping_existente["Días de diseño"]: "dias_diseno",
        mapping_existente["Días de fabricación"]: "dias_fabricacion",
        mapping_existente["Días de respuesta del pedido"]: "dias_respuesta_pedido",
        mapping_existente["Estado"]: "estado"
    })

    # Reemplazar valores problemáticos
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.where(pd.notnull(df), None)

    # ✅ Filtrar filas sin código
    df = df[df["codigo"].notnull()]
    df = df[df["codigo"] != ""]

    # ✅ Eliminar duplicados por código (último valor)
    df = df.drop_duplicates(subset=["codigo"], keep="last")

    # ✅ Conversión de tipos
    def limpiar_valor(v):
        if v is None or (isinstance(v, float) and (pd.isna(v) or np.isnan(v))):
            return None
        if isinstance(v, (np.int64, int)):
            return int(v)
        if isinstance(v, (np.float64, float)):
            return int(v) if v.is_integer() else float(v)
        return v

    return [{k: limpiar_valor(v) for k, v in row.items()} for row in df.to_dict(orient="records")]
