import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.excel.excel_service import procesar_excel
from services.supabase_service import (
    upsert_dispositivos,
    obtener_dispositivos,
    obtener_indicadores,
)

app = FastAPI(title="API Control de Dispositivo")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://control-de-dispositivos.vercel.app"  # ✅ solo tu frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    try:
        dispositivos = procesar_excel(file)
        if not dispositivos:
            raise HTTPException(status_code=400, detail="El archivo no contiene datos válidos.")
        resultado = upsert_dispositivos(dispositivos)
        return {"status": "ok", "insertados": len(resultado)}
    except Exception:
        print("❌ ERROR procesando Excel:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error procesando el archivo")

@app.get("/dispositivos")
async def get_dispositivos():
    try:
        return obtener_dispositivos()
    except Exception:
        print("❌ ERROR obteniendo dispositivos:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error obteniendo dispositivos")

@app.get("/indicadores")
async def get_indicadores():
    try:
        return obtener_indicadores()
    except Exception:
        print("❌ ERROR obteniendo indicadores:\n", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Error obteniendo indicadores")

@app.get("/")
async def root():
    return {"status": "API corriendo correctamente"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
