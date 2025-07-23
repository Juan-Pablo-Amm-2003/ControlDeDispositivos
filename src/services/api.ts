import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // ✅ conexión real al backend local
});

// ✅ Obtener lista de dispositivos
export const getDispositivos = async () => {
  const { data } = await api.get("/dispositivos");
  return data;
};

// ✅ Obtener indicadores
export const getIndicadores = async () => {
  const { data } = await api.get("/indicadores");
  return data;
};

// ✅ Subir archivo Excel
export const uploadExcel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export default api;
