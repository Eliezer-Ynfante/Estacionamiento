export const obtenerPlazas = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/plaza/plazas");
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener plazas:", error);
    return [];
  }
};

export const obtenerPlazasDisponibles = async (fecha_inicio, fecha_fin) => {
  try {
    const params = new URLSearchParams();
    if (fecha_inicio) params.append("fecha_inicio", fecha_inicio);
    if (fecha_fin) params.append("fecha_fin", fecha_fin);
    const response = await fetch(`http://localhost:3000/api/plaza/plazas/disponibles?${params.toString()}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener plazas disponibles:", error);
    return [];
  }
}; 

export const obtenerDetallePlaza = async (plaza_id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/plaza/plaza/${plaza_id}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener detalle de la plaza:", error);
    return null;
  }
};

