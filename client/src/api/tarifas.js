export const obtenerTarifas = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/tarifas/tarifas");
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener tarifas:", error);
    return [];
  }
};
