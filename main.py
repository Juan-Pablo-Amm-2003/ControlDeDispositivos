from fastapi import FastAPI, UploadFile, File
from services.excel_service import procesar_excel
from services.supabase_service import upsert_dispositivos

app = FastAPI(title="API Control de Dispositivos")

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    dispositivos = procesar_excel(file)  
    resultado = upsert_dispositivos(dispositivos)
    return {"status": "ok", "insertados": len(resultado)}
