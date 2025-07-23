import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.excel.excel_service import procesar_excel
from services.supabase_service import upsert_dispositivos, obtener_dispositivos, obtener_indicadores

app = FastAPI(title="API Control de Dispositivo")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
    except Exception as e:
        print("❌ ERROR procesando Excel:\n", traceback.format_exc())  
        raise HTTPException(status_code=500, detail=f"Error procesando el archivo: {str(e)}")


@app.get("/dispositivos")
async def get_dispositivos():
    try:
        data = obtener_dispositivos()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo dispositivos: {str(e)}")


@app.get("/indicadores")
async def get_indicadores():
    try:
        data = obtener_indicadores()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo indicadores: {str(e)}")


@app.get("/")
async def root():
    return {"status": "API corriendo correctamente"}
