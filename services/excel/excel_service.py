import pandas as pd
from services.excel.utils_excel import limpiar_y_transformar_df

def procesar_excel(upload_file):
    if upload_file.filename.endswith(".xlsx"):
        df = pd.read_excel(upload_file.file)
    else:
        df = pd.read_csv(upload_file.file, delimiter=';', encoding='latin-1')
    return limpiar_y_transformar_df(df)
