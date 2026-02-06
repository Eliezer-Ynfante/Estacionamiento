import { useState, useMemo, useEffect } from "react"
import { Calendar, Clock, CreditCard, X, Tag, Info } from "lucide-react"
import { obtenerTodasTarifas } from "@api/tarifas"
import { crearReserva } from "@api/reservar"
import { validarPago } from "@api/pagos"
import { obtenerMisVehiculos } from "@api/vehiculos"
import { obtenerServicios } from "@api/servicio_adicional"
import { useAuthUser } from "@hooks/useAuthUser"
import { vehicleTypes, typeVehiculoMap, periods } from "@util/bookingConstants"
import {
  formatDateTime,
  calculateExitDateTime,
  calculateReservationPrice,
  findVehicleByType,
  createReservaPayload,
} from "@util/bookingUtils"

export default function BookingView() {
  const { usuario } = useAuthUser()
  const isAuthenticated = !!usuario
  
  const [vehicle, setVehicle] = useState("auto")
  const [period, setPeriod] = useState("hora")
  const [entryDate, setEntryDate] = useState(() => formatDateTime(new Date()).date)
  const [entryTime, setEntryTime] = useState(() => formatDateTime(new Date()).time)
  const [exitDate, setExitDate] = useState("")
  const [exitTime, setExitTime] = useState("")
  const [selectedServices, setSelectedServices] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })
  const [tarifa, setTarifa] = useState(null)
  const [servicios, setServicios] = useState([])
  const [vehiculos, setVehiculos] = useState([])
  const [loadingReserva, setLoadingReserva] = useState(false)
  const [paymentReintentos, setPaymentReintentos] = useState(3)
  const [paymentToken, setPaymentToken] = useState(null)
  const [paymentError, setPaymentError] = useState("")

  // Cargar tarifas, servicios y vehículos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [tarifasData, serviciosData, vehiculosData] = await Promise.all([
          obtenerTodasTarifas(),
          obtenerServicios(),
          obtenerMisVehiculos()
        ])

        // Obtener tarifa del tipo de vehículo
        if (tarifasData.data && Array.isArray(tarifasData.data)) {
          const tarifaAuto = tarifasData.data.find(t => t.tipo_vehiculo_id === typeVehiculoMap["auto"])
          if (tarifaAuto) setTarifa(tarifaAuto)
        }

        // Cargar servicios
        const serviciosArray = serviciosData.data || (Array.isArray(serviciosData) ? serviciosData : [])
        setServicios(serviciosArray)

        // Cargar vehículos
        const vehiculosArray = vehiculosData.data || (Array.isArray(vehiculosData) ? vehiculosData : [])
        setVehiculos(vehiculosArray)
        
        // Seleccionar primer vehículo por defecto
        if (vehiculosArray.length > 0) {
          setSelectedVehiculo(vehiculosArray[0])
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }

    cargarDatos()
  }, [])

  // Actualizar tarifa cuando cambia el tipo de vehículo
  useEffect(() => {
    const cargarTarifa = async () => {
      try {
        const tarifasData = await obtenerTodasTarifas()
        if (tarifasData.data && Array.isArray(tarifasData.data)) {
          const vlower = vehicle.toString().toLowerCase()
          const tarifaEncontrada = tarifasData.data.find(t => {
            const tipoNombre = (t.tipo && t.tipo.nombre) ? t.tipo.nombre.toString().toLowerCase() : ''
            return tipoNombre.includes(vlower) || tipoNombre === vlower
          })
          if (tarifaEncontrada) setTarifa(tarifaEncontrada)
        }
      } catch (error) {
        console.error("Error al cargar tarifa:", error)
      }
    }

    cargarTarifa()
  }, [vehicle])

  // Seleccionar automáticamente un vehículo del usuario según el tipo seleccionado (buscar por nombre)
  useEffect(() => {
    if (!vehiculos || vehiculos.length === 0) return
    const match = findVehicleByType(vehiculos, vehicle)
    if (match) {
      setSelectedVehiculo(match)
    } else if (!selectedVehiculo) {
      setSelectedVehiculo(vehiculos[0])
    }
  }, [vehicle, vehiculos, selectedVehiculo])

  // Lógica de actualización del período
  const handlePeriodSelect = (selectedPeriodId) => {
    setPeriod(selectedPeriodId)

    const { entry, exit } = calculateExitDateTime(selectedPeriodId)
    setEntryDate(entry.date)
    setEntryTime(entry.time)
    setExitDate(exit.date)
    setExitTime(exit.time)
  }

  // Cálculo de Precios (Memoizado) - aplica tarifa según periodo seleccionado
  const calculation = useMemo(() => {
    return calculateReservationPrice(
      tarifa,
      entryDate,
      entryTime,
      exitDate,
      exitTime,
      period,
      selectedServices,
      servicios
    )
  }, [period, entryDate, entryTime, exitDate, exitTime, selectedServices, tarifa, servicios])

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfirmPayment = async () => {
    if (!selectedVehiculo || !calculation) {
      setPaymentError("Por favor completa todos los datos de la reserva")
      return
    }

    // Validar que los datos de pago estén completos
    if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiry || !paymentData.cvv) {
      setPaymentError("Por favor completa todos los datos de la tarjeta")
      return
    }

    // Validar que el cálculo tiene un monto válido
    if (!calculation.total || parseFloat(calculation.total) <= 0) {
      setPaymentError("Error al calcular el monto. Verifica las fechas y duración")
      return
    }

    setLoadingReserva(true)
    setPaymentError("")

    try {
      // PASO 1: Validar el pago (sin crear reserva)
      const pagoData = {
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''), // Remover espacios
        cardName: paymentData.cardName.trim(),
        expiry: paymentData.expiry.trim(),
        cvv: paymentData.cvv.trim(),
        monto: parseFloat(calculation.total)
      }

      const resultadoValidacion = await validarPago(pagoData)

      if (!resultadoValidacion.success) {
        setPaymentError(resultadoValidacion.error || "Pago rechazado, intenta nuevamente")
        setPaymentReintentos(prev => prev - 1)
        
        if (paymentReintentos - 1 <= 0) {
          alert("Máximo de intentos alcanzado. Por favor intenta más tarde.")
          setShowPaymentModal(false)
          setPaymentReintentos(3)
        }
        return
      }

      // PASO 2: Pago validado - Guardar el token
      setPaymentToken(resultadoValidacion.data.paymentToken)
      setPaymentReintentos(3) // Reiniciar contador

      // PASO 3: Crear la reserva con el payment token
      const reservaData = {
        ...createReservaPayload(
          selectedVehiculo.id,
          entryDate,
          entryTime,
          exitDate,
          exitTime,
          selectedServices
        ),
        paymentToken: resultadoValidacion.data.paymentToken
      }

      const resultadoReserva = await crearReserva(reservaData)

      if (!resultadoReserva.success) {
        const errorMsg = resultadoReserva.message || resultadoReserva.error || "Error desconocido al crear la reserva"
        alert(`Error: ${errorMsg}`)
        console.error('Error creando reserva:', resultadoReserva)
        return
      }

      // ÉXITO COMPLETO
      alert(`¡Reserva Confirmada! Código: ${resultadoReserva.data.codigo}\nTransacción: ${resultadoValidacion.data.transaccionId}`)
      setShowPaymentModal(false)
      
      // Reiniciar formulario
      setSelectedVehiculo(vehiculos[0] || null)
      setSelectedServices([])
      setPaymentData({ cardNumber: "", cardName: "", expiry: "", cvv: "" })
      setPaymentToken(null)
      setPaymentError("")
      
      // Reiniciar fechas
      const now = new Date()
      setEntryDate(formatDateTime(now).date)
      setEntryTime(formatDateTime(now).time)
      
    } catch (error) {
      console.error('Error en handleConfirmPayment:', error);
      console.error('Detalles:', error.details);
      
      // Si el error es por validación de pago (400), contar reintentos
      if (error.status === 402) {
        setPaymentError(error.message || "El pago fue rechazado")
        setPaymentReintentos(prev => prev - 1)
        
        if (paymentReintentos - 1 <= 0) {
          alert("Máximo de intentos alcanzado. Por favor intenta más tarde.")
          setShowPaymentModal(false)
          setPaymentReintentos(3)
        }
      } else {
        // Otros errores (validación de reserva, etc)
        alert(`Error: ${error.message}`)
        console.error('Error completo:', error.details);
      }
    } finally {
      setLoadingReserva(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-12 pb-16 font-sans">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-full">
          <div className="max-w-md text-center px-4">
            <h1 className="text-3xl font-bold text-white mb-4">Acceso Requerido</h1>
            <p className="text-neutral-400 mb-6">Debes estar autenticado para realizar reservas.</p>
            <a href="/login" className="inline-block bg-orange-600 hover:bg-orange-700 text-black font-bold py-3 px-8 rounded-lg">
              Iniciar Sesión
            </a>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <header className="mb-8 md:mb-10 border-b border-neutral-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
              <span className="text-orange-600 font-bold">Reservar</span> Estacionamiento
            </h1>
            <p className="text-neutral-500 text-sm mt-1">Seleccione período, vehículo y horario</p>
          </header>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Vehículo y Período */}
            <div className="border border-neutral-800 p-6 rounded-xl">
              <h2 className="text-lg font-light text-white mb-5 uppercase tracking-wider">1. Vehículo y Período</h2>
              
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase">Vehículo</label>
                  <div className="flex flex-wrap gap-2">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setVehicle(type.value)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          vehicle === type.value
                            ? "bg-orange-600 text-black border-2 border-orange-600"
                            : "bg-neutral-900 text-white border-2 border-neutral-700 hover:border-orange-600"
                        }`}
                      >
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase">Período</label>
                  <div className="flex flex-wrap gap-2">
                    {periods.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePeriodSelect(p.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          period === p.id
                            ? "bg-orange-600 text-black border-2 border-orange-600"
                            : "bg-neutral-900 text-white border-2 border-neutral-700 hover:border-orange-600"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Fechas y Horarios */}
            <div className="border border-neutral-800 p-6 rounded-xl">
              <h2 className="text-lg font-light text-white mb-5 uppercase tracking-wider">2. Fechas y Horarios</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-orange-600 text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Ingreso
                  </p>
                  <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" />
                  <input type="time" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" />
                </div>
                
                <div className="space-y-4">
                  <p className="text-orange-600 text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Salida
                  </p>
                  <input type="date" value={exitDate} onChange={(e) => setExitDate(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" />
                  <input type="time" value={exitTime} onChange={(e) => setExitTime(e.target.value)} className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" />
                </div>
              </div>
            </div>

            {/* 3. Seleccionar Vehículo */}
            <div className="border border-neutral-800 p-6 rounded-xl">
              <h2 className="text-lg font-light text-white mb-5 uppercase tracking-wider">3. Tu Vehículo</h2>
              <select
                value={selectedVehiculo?.id || ""}
                onChange={(e) => {
                  const v = vehiculos.find(v => v.id === parseInt(e.target.value))
                  setSelectedVehiculo(v)
                }}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3"
              >
                <option value="">Selecciona un vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.marca || "Sin marca"} ({v.tipo?.nombre || ""})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Servicios Adicionales */}
            <div className="border border-neutral-800 p-6 rounded-xl">
              <h2 className="text-lg font-light text-white mb-5 uppercase tracking-wider">4. Servicios Adicionales</h2>
              <div className="space-y-3">
                {servicios.map((service) => (
                  <label key={service.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? "border-orange-600 bg-neutral-900"
                      : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="w-4 h-4 rounded mt-1 accent-orange-600"
                    />
                    <div className="ml-3 flex-1">
                      <span className="text-white text-sm font-semibold">{service.nombre}</span>
                      <p className="text-neutral-500 text-xs mt-0.5">{service.descripcion}</p>
                    </div>
                    <span className="text-orange-600 font-bold text-sm ml-4">+S/ {parseFloat(service.precio).toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen y Pago */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-neutral-950 rounded-xl p-6 border border-orange-600/30">
                <div className="flex items-center gap-3 mb-6 border-b border-neutral-900 pb-4">
                  <Tag className="h-5 w-5 text-orange-600" />
                  <h3 className="text-xl font-light text-white uppercase">Resumen</h3>
                </div>

                {calculation ? (
                  <div className="space-y-4">
                    <div className="space-y-2 pb-4 border-b border-neutral-900">
                      <p className="text-neutral-500 text-xs font-semibold uppercase">Usuario</p>
                      <p className="text-white font-bold">{usuario?.nombre} <span className="text-neutral-400 text-sm block">{usuario?.correo_electronico}</span></p>
                    </div>

                    <div className="space-y-2 pb-4 border-b border-neutral-900">
                      <p className="text-neutral-500 text-xs font-semibold uppercase">Vehículo</p>
                      <p className="text-white font-bold">{selectedVehiculo?.placa} - {selectedVehiculo?.marca}</p>
                    </div>
                    
                    <div className="space-y-2 pb-4 border-b border-neutral-900">
                      <p className="text-neutral-500 text-xs font-semibold uppercase">Duración</p>
                      <p className="text-white font-bold">{calculation.duration}</p>
                    </div>

                    <div className="space-y-3 pb-4 border-b border-neutral-900">
                      {tarifa && (
                        <div className="text-xs text-neutral-400 mb-2">
                          <div>Tarifa por hora: S/ {parseFloat(tarifa.precio_hora).toFixed(2)}</div>
                          <div>Tarifa por día: S/ {parseFloat(tarifa.precio_dia).toFixed(2)}</div>
                          <div>Tarifa por semana: S/ {parseFloat(tarifa.precio_semana).toFixed(2)}</div>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Tarifa aplicada</span>
                        <span className="text-white font-bold">S/ {calculation.basePrice}</span>
                      </div>
                      {parseFloat(calculation.servicesPrice) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Servicios</span>
                          <span className="text-orange-600 font-bold">S/ {calculation.servicesPrice}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <p className="text-lg font-light text-neutral-400 uppercase">Total</p>
                      <p className="text-4xl font-extrabold text-orange-600">S/ {calculation.total}</p>
                    </div>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      disabled={loadingReserva || !selectedVehiculo}
                      className="w-full mt-6 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 text-black font-bold py-3 rounded-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {loadingReserva ? "Procesando..." : "Proceder al Pago"}
                    </button>
                  </div>
                ) : (
                  <p className="text-neutral-600 text-center py-8 text-sm italic">Complete los detalles para ver el cálculo.</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-600 mt-1 shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">Nota</p>
                  <p className="text-neutral-500 text-xs mt-0.5">El precio final puede variar según la hora de salida real.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-950 rounded-xl border border-neutral-800 max-w-lg w-full p-6 relative">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-neutral-600 hover:text-white">
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-2xl font-light text-white mb-2 uppercase">Pago Seguro</h2>
              <p className="text-neutral-500 mb-4 text-sm">Ingrese los detalles de su tarjeta.</p>

              {/* Contador de reintentos */}
              <div className="mb-4 p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <p className="text-xs text-neutral-400">Intentos disponibles:</p>
                <p className="text-sm font-bold text-orange-600">{paymentReintentos}/3</p>
              </div>

              {/* Mensaje de error */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-600/10 border border-red-600 rounded-lg">
                  <p className="text-xs text-red-400 font-semibold">Error</p>
                  <p className="text-sm text-red-300">{paymentError}</p>
                </div>
              )}

              <div className="space-y-4">
                <input type="text" name="cardNumber" placeholder="Número de tarjeta" value={paymentData.cardNumber} onChange={handlePaymentChange} maxLength="19" className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" disabled={paymentToken !== null} />
                <input type="text" name="cardName" placeholder="Nombre del titular" value={paymentData.cardName} onChange={handlePaymentChange} className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" disabled={paymentToken !== null} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="expiry" placeholder="MM/YY" value={paymentData.expiry} onChange={handlePaymentChange} maxLength="5" className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" disabled={paymentToken !== null} />
                  <input type="text" name="cvv" placeholder="CVV" value={paymentData.cvv} onChange={handlePaymentChange} maxLength="3" className="w-full rounded-lg bg-neutral-900 border border-neutral-700 text-white p-3" disabled={paymentToken !== null} />
                </div>

                <div className="bg-orange-600/10 border-l-4 border-orange-600 p-4 mt-6">
                  <p className="text-neutral-300 text-sm mb-1.5">Monto Total</p>
                  <p className="text-3xl font-extrabold text-white">S/ {calculation?.total}</p>
                </div>

                <button onClick={handleConfirmPayment} disabled={loadingReserva || paymentReintentos <= 0} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 text-black font-bold py-3 rounded-lg transition-all uppercase tracking-widest">
                  {loadingReserva ? "Procesando pago..." : `Pagar S/ ${calculation?.total}`}
                </button>

                {paymentReintentos <= 0 && (
                  <p className="text-xs text-center text-red-400 font-semibold">Máximo de intentos alcanzado. Cierra el modal e intenta más tarde.</p>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  )
}