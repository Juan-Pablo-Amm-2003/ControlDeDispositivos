import axios from "axios";

const api = axios.create({
  baseURL: "https://controldedispositivos.onrender.com",  
  timeout: 10000,  
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
