import React, { useState, DragEvent } from "react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (newFile: File | null) => {
    setError("");
    setFile(newFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("⚠ Por favor selecciona un archivo.");
    setUploading(true);

    try {
      await onUpload(file);
    } catch (error) {
      console.error("❌ Error al subir el archivo:", error);
      setError("❌ Hubo un problema al subir el archivo.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 border rounded shadow-md bg-white max-w-md mx-auto"
    >
      {/* ✅ Zona Drag & Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        <input
          type="file"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="text-gray-600 cursor-pointer">
          {file ? (
            <span className="text-blue-600 font-medium">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </span>
          ) : (
            "Haz clic o arrastra un archivo aquí"
          )}
        </label>
      </div>

      {/* ✅ Mensaje de error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* ✅ Botones */}
      <div className="flex justify-between gap-2">
        {file && (
          <button
            type="button"
            onClick={() => handleFileChange(null)}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 text-sm"
          >
            ❌ Limpiar
          </button>
        )}
        <button
          type="submit"
          disabled={!file || uploading}
          className={`flex-1 px-4 py-2 rounded text-white transition-colors ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "⏳ Subiendo..." : "⬆ Subir Excel"}
        </button>
      </div>
    </form>
  );
};

export default FileUpload;
