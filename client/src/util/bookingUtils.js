/**
 * Formatea una fecha a objetos de date y time en formato ISO
 */
export const formatDateTime = (dateObj) => {
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  const hours = String(dateObj.getHours()).padStart(2, "0")
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  }
}

/**
 * Calcula la fecha y hora de salida basada en el período seleccionado
 */
export const calculateExitDateTime = (period) => {
  const now = new Date()
  const entryFormatted = formatDateTime(now)

  const exitDateObj = new Date(now)
  
  if (period === "hora") {
    exitDateObj.setHours(exitDateObj.getHours() + 1)
  } else if (period === "dia") {
    exitDateObj.setDate(exitDateObj.getDate() + 1)
  } else if (period === "semana") {
    exitDateObj.setDate(exitDateObj.getDate() + 7)
  }

  const exitFormatted = formatDateTime(exitDateObj)

  return {
    entry: entryFormatted,
    exit: exitFormatted,
  }
}

/**
 * Calcula el precio de la reserva según tarifa, período y servicios
 */
export const calculateReservationPrice = (
  tarifa,
  entryDate,
  entryTime,
  exitDate,
  exitTime,
  period,
  selectedServices,
  servicios
) => {
  if (!tarifa || !entryDate || !entryTime || !exitDate || !exitTime) return null

  const entry = new Date(`${entryDate}T${entryTime}`)
  const exit = new Date(`${exitDate}T${exitTime}`)
  if (exit <= entry) return null

  const diffMs = exit - entry
  const hoursExact = diffMs / (1000 * 60 * 60)
  const hours = Math.ceil(hoursExact)
  const days = Math.ceil(hoursExact / 24)
  const weeks = Math.ceil(hoursExact / (24 * 7))

  // Servicios seleccionados y costo
  const serviciosSelected = selectedServices
    .map(id => servicios.find(s => s.id === id))
    .filter(Boolean)
  const servicioCosto = serviciosSelected.reduce(
    (acc, s) => acc + parseFloat(s.precio || 0),
    0
  )

  // Aplicar tarifa según período elegido
  const precioHora = parseFloat(tarifa.precio_hora)
  const precioDia = parseFloat(tarifa.precio_dia)
  const precioSemana = parseFloat(tarifa.precio_semana)

  let basePrice = 0
  if (period === "hora") basePrice = hours * precioHora
  else if (period === "dia") basePrice = days * precioDia
  else basePrice = weeks * precioSemana

  const total = parseFloat((basePrice + servicioCosto).toFixed(2))

  return {
    basePrice: basePrice.toFixed(2),
    servicesPrice: servicioCosto.toFixed(2),
    total: total.toFixed(2),
    duration: period === "hora" ? `${hours}h` : period === "dia" ? `${days}d` : `${weeks}w`,
    serviciosSelected,
  }
}

/**
 * Encuentra un vehículo que coincida con el tipo especificado
 */
export const findVehicleByType = (vehiculos, vehicleType) => {
  if (!vehiculos || vehiculos.length === 0) return null
  
  const vlower = vehicleType.toString().toLowerCase()
  return vehiculos.find(v => {
    const tipoNombre = (v.tipo && v.tipo.nombre)
      ? v.tipo.nombre.toString().toLowerCase()
      : ""
    return tipoNombre.includes(vlower) || tipoNombre === vlower
  })
}

/**
 * Crea el objeto de datos para la reserva
 */
export const createReservaPayload = (
  vehiculoId,
  entryDate,
  entryTime,
  exitDate,
  exitTime,
  selectedServices
) => {
  return {
    vehiculo_id: vehiculoId,
    fecha_hora_inicio: `${entryDate}T${entryTime}:00`,
    fecha_hora_fin: `${exitDate}T${exitTime}:00`,
    servicio_id: selectedServices.length > 0 ? selectedServices[0] : null,
  }
}
