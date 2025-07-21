from supabase import create_client
import os
from dotenv import load_dotenv

# ✅ Cargar el archivo .env al inicio
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception(f"Faltan variables de entorno. URL: {SUPABASE_URL}, KEY: {SUPABASE_KEY}")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upsert_dispositivos(dispositivos):
    data = supabase.table("control_dispositivos").upsert(
        dispositivos, on_conflict="codigo"
    ).execute()
    return data.data
