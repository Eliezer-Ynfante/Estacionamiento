import { useState, useMemo, useEffect } from "react"
import { Calendar, Clock, MapPin, Truck, Car, Bike, CreditCard, Check, X, Tag, Info, List } from "lucide-react"
import { obtenerTarifas } from "../../api/tarifas"

// --- Datos de Configuración (Mantenidos) ---

const vehicleTypes = [
  { value: "auto", label: "Automóvil", icon: Car },
  { value: "camion", label: "Camión / Van", icon: Truck },
  { value: "moto", label: "Motocicleta", icon: Bike },
]

const additionalServices = [
  { id: "lavado", label: "Lavado Estándar", price: 15, description: "Limpieza exterior del vehículo." },
  { id: "valet", label: "Asistencia en Plaza", price: 10, description: "Servicio de ayuda para estacionar." },
]

// Función para transformar datos de API al formato de pricingData
const transformTariffData = (tarifas) => {
  const pricingData = {
    hora: { auto: [], moto: [], camion: [] },
    dia: { auto: [], moto: [], camion: [] },
    semana: { auto: [], moto: [], camion: [] },
  }

  tarifas.forEach((tarifa) => {
    const nombre = tarifa.nombre.toLowerCase()
    const features = tarifa.descripcion
      ? tarifa.descripcion.split(",").map(f => f.trim()).filter(f => f)
      : ["Plan disponible"]

    // Determinar tipo de vehículo
    let vehicleType = "auto"
    if (nombre.includes("moto")) vehicleType = "moto"
    if (nombre.includes("camion")) vehicleType = "camion"

    // Agregar a cada período
    pricingData.hora[vehicleType].push({
      name: tarifa.nombre.replace(/auto|moto|camion/i, "").trim(),
      price: tarifa.precio_hora,
      features,
    })

    pricingData.dia[vehicleType].push({
      name: tarifa.nombre.replace(/auto|moto|camion/i, "").trim(),
      price: tarifa.precio_dia,
      features,
    })

    pricingData.semana[vehicleType].push({
      name: tarifa.nombre.replace(/auto|moto|camion/i, "").trim(),
      price: tarifa.precio_semana,
      features,
    })
  })

  return pricingData
}

const periods = [
  { id: "hora", label: "Por Hora" },
  { id: "dia", label: "Por Día" },
  { id: "semana", label: "Por Semana" },
]

// Función auxiliar para formatear fechas
const formatDateTime = (dateObj) => {
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

// --- Componente Principal ---

export default function MinimalistBookingView() {
  const [vehicle, setVehicle] = useState("auto")
  const [period, setPeriod] = useState("hora")
  const [planType, setPlanType] = useState("básico")
  const [entryDate, setEntryDate] = useState(() => formatDateTime(new Date()).date)
  const [entryTime, setEntryTime] = useState(() => formatDateTime(new Date()).time)
  const [exitDate, setExitDate] = useState("")
  const [exitTime, setExitTime] = useState("")
  const [selectedServices, setSelectedServices] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })
  const [pricingData, setPricingData] = useState({
    hora: { auto: [], moto: [], camion: [] },
    dia: { auto: [], moto: [], camion: [] },
    semana: { auto: [], moto: [], camion: [] },
  })
  const [ , setLoadingTarifas] = useState(true)

  // Cargar tarifas al montar el componente
  useEffect(() => {
    const cargarTarifas = async () => {
      try {
        const tarifas = await obtenerTarifas()
        const datosTransformados = transformTariffData(tarifas)
        setPricingData(datosTransformados)
      } catch (error) {
        console.error("Error al cargar tarifas:", error)
      } finally {
        setLoadingTarifas(false)
      }
    }

    cargarTarifas()
  }, [])

  // Lógica de actualización del plan y fechas
  const handlePeriodSelect = (selectedPeriodId) => {
    setPeriod(selectedPeriodId)
    
    // 1. Seleccionar el primer plan del nuevo periodo
    if (vehicle && pricingData[selectedPeriodId] && pricingData[selectedPeriodId][vehicle]) {
      const defaultPlanName = pricingData[selectedPeriodId][vehicle][0].name.toLowerCase()
      setPlanType(defaultPlanName)
    }

    // 2. Lógica de fechas automática (para prellenado)
    const now = new Date()
    const entryFormatted = formatDateTime(now)
    setEntryDate(entryFormatted.date)
    setEntryTime(entryFormatted.time)

    const exitDateObj = new Date(now)
    
    if (selectedPeriodId === "hora") {
      exitDateObj.setHours(exitDateObj.getHours() + 1)
    } else if (selectedPeriodId === "dia") {
      exitDateObj.setDate(exitDateObj.getDate() + 1)
    } else if (selectedPeriodId === "semana") {
      exitDateObj.setDate(exitDateObj.getDate() + 7)
    }

    const exitFormatted = formatDateTime(exitDateObj)
    setExitDate(exitFormatted.date)
    setExitTime(exitFormatted.time)
  }

  // Cálculo de Precios (Memoizado)
  const calculation = useMemo(() => {
    if (!vehicle || !entryDate || !entryTime || !exitDate || !exitTime) {
      return null
    }

    const entry = new Date(`${entryDate}T${entryTime}`)
    const exit = new Date(`${exitDate}T${exitTime}`)
    const diffMs = exit.getTime() - entry.getTime()

    if (diffMs <= 0) return null

    const hours = Math.ceil(diffMs / (1000 * 60 * 60))
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const weeks = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7))

    const plans = pricingData[period][vehicle]
    
    // Comparación robusta y fallback
    const selectedPlan = plans.find(p => p.name.toLowerCase() === planType.toLowerCase())
    const planDetails = selectedPlan || plans[0] // Si no encuentra, usa el primero
    
    const rate = planDetails.price
    
    let basePrice
    if (period === "hora") {
      basePrice = hours * rate
    } else if (period === "dia") {
      basePrice = days * rate
    } else {
      basePrice = weeks * rate
    }

    const servicesPrice = selectedServices.reduce((acc, serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId)
      return acc + (service?.price || 0)
    }, 0)

    return {
      rate,
      basePrice: basePrice.toFixed(2),
      servicesPrice: servicesPrice.toFixed(2),
      total: (basePrice + servicesPrice).toFixed(2),
      planName: planDetails.name,
      duration: period === "hora" ? `${hours}h` : period === "dia" ? `${days}d` : `${weeks}s`,
    }
  }, [vehicle, period, planType, entryDate, entryTime, exitDate, exitTime, selectedServices])

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleConfirmPayment = () => {
    alert("¡Reserva Confirmada! Pago procesado exitosamente.")
    setShowPaymentModal(false)
    // ... Reiniciar estados
  }
  
  const currentPlans = vehicle ? pricingData[period][vehicle] : []

  return (
    <div className="min-h-screen bg-black pt-12 pb-16 font-sans">
      <style>{`
        /* Configuración de fuente Montserrat */
        /* Aplicamos Montserrat/Open Sans como fuente principal para todo */
        .font-sans {
            font-family: 'Montserrat', 'Open Sans', sans-serif !important;
        }

        /* Configuración minimalista del input date/time */
        ::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
        }
        /* Estilo para el enfoque minimalista */
        .input-minimal {
            background-color: #0a0a0a; /* neutral-950 más oscuro */
            border: 1px solid #3f3f46; /* neutral-700 */
            color: white;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-minimal:focus {
            outline: none;
            border-color: #f97316; /* orange-600 */
            box-shadow: 0 0 0 1px #f97316;
        }
      `}</style>
      
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <header className="mb-8 md:mb-10 border-b border-neutral-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-light text-white uppercase tracking-widest">
            <span className="text-orange-600 font-bold">Reservar</span> Estacionamiento
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Seleccione su vehículo, período y plan</p>
        </header>

        {/* Estructura Responsive: Stacks on mobile, 8/4 grid on large screens */}
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* --- Columna Principal de Selección (lg:col-span-8) --- */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* 1. TIPO DE ESTACIONAMIENTO (VEHÍCULO Y PERÍODO) - COMPACTO Y RESPONSIVO */}
            <div className="border border-neutral-800 p-4 sm:p-6 rounded-xl">
              <h2 className="text-lg md:text-xl font-light text-white mb-5 uppercase tracking-wider">
                1. Tipo de Vehículo y Período de Estacionamiento
              </h2>
              
              {/* Contenedor responsive: Stacks on mobile, 3/5 y 2/5 columns on tablet/desktop */}
              <div className="grid md:grid-cols-5 gap-6">
                
                {/* Tipo de Vehículo */}
                <div className="md:col-span-3">
                  <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase tracking-wider">
                    Vehículo
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {vehicleTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                            setVehicle(type.value)
                            if (pricingData[period][type.value]) {
                                setPlanType(pricingData[period][type.value][0].name.toLowerCase())
                            }
                        }}
                        className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                          vehicle === type.value
                            ? "bg-orange-600 text-black border-2 border-orange-600 font-bold"
                            : "bg-neutral-900 text-white border-2 border-neutral-700 hover:border-orange-600"
                        }`}
                      >
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Período de Tiempo */}
                <div className="md:col-span-2">
                  <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase tracking-wider">
                    Período
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {periods.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePeriodSelect(p.id)}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                          period === p.id
                            ? "bg-orange-600 text-black border-2 border-orange-600 font-bold"
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
            
            {/* 2. DEFINIR FECHAS Y HORARIOS (ALTA PRIORIDAD) */}
            <div className="border border-neutral-800 p-4 sm:p-6 rounded-xl">
              <h2 className="text-lg md:text-xl font-light text-white mb-5 uppercase tracking-wider">
                2. Definir Fechas y Horarios
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                
                {/* Entrada */}
                <div className="space-y-4">
                  <p className="text-orange-600 text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
                    <Calendar className="h-4 w-4" /> Fecha y Hora de Ingreso
                  </p>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full rounded-lg input-minimal"
                  />
                  <input
                    type="time"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="w-full rounded-lg input-minimal"
                  />
                </div>
                
                {/* Salida */}
                <div className="space-y-4">
                  <p className="text-orange-600 text-sm font-semibold flex items-center gap-2 uppercase tracking-wider">
                    <Clock className="h-4 w-4" /> Fecha y Hora de Salida
                  </p>
                  <input
                    type="date"
                    value={exitDate}
                    onChange={(e) => setExitDate(e.target.value)}
                    className="w-full rounded-lg input-minimal"
                  />
                  <input
                    type="time"
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    className="w-full rounded-lg input-minimal"
                  />
                </div>
              </div>
            </div>

            {/* 3. SELECCIONAR PLAN DE TARIFA */}
            {vehicle && (
              <div className="border border-neutral-800 p-4 sm:p-6 rounded-xl">
                <h2 className="text-lg md:text-xl font-light text-white mb-5 uppercase tracking-wider">
                  3. Seleccionar Plan de Tarifa
                </h2>
                
                {/* Selección de Plan */}
                <div>
                  <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase tracking-wider">
                    Planes Disponibles ({periods.find(p => p.id === period)?.label})
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentPlans.map((plan) => (
                      <div
                        key={plan.name}
                        onClick={() => setPlanType(plan.name.toLowerCase())}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          planType === plan.name.toLowerCase()
                            ? "border-orange-600 bg-orange-600/10 shadow-lg shadow-orange-600/10"
                            : "border-neutral-800 hover:border-neutral-600 bg-neutral-900"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-sm font-bold ${planType === plan.name.toLowerCase() ? "text-orange-600" : "text-white"}`}>{plan.name}</span>
                            {/* Ajuste de tamaño para responsividad */}
                            <span className="text-xl sm:text-2xl font-extrabold text-white">S/ {plan.price}</span>
                        </div>
                        <p className="text-neutral-500 text-xs italic mb-2">{plan.features[0]}</p>
                        <ul className="space-y-1 mt-3">
                           {plan.features.slice(1).map((feature, idx) => (
                             <li key={idx} className="flex items-center text-xs text-neutral-400">
                               <Check className="h-3 w-3 text-orange-600 mr-2 flex-shrink-0" />
                               {feature}
                             </li>
                           ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* 4. SERVICIOS ADICIONALES (ÚLTIMO) */}
            <div className="border border-neutral-800 p-4 sm:p-6 rounded-xl">
                <h2 className="text-lg md:text-xl font-light text-white mb-5 uppercase tracking-wider">
                  4. Servicios Adicionales
                </h2>
                <label className="text-neutral-500 text-xs font-semibold block mb-3 uppercase tracking-wider">
                  Seleccione si aplica (Opcional)
                </label>
                <div className="space-y-3">
                  {additionalServices.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedServices.includes(service.id)
                          ? "border-orange-600 bg-neutral-900"
                          : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="w-4 h-4 rounded appearance-none cursor-pointer mt-1 flex-shrink-0 border-2 border-neutral-600 checked:bg-orange-600 checked:border-orange-600 transition"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-white text-sm font-semibold">{service.label}</span>
                        <p className="text-neutral-500 text-xs mt-0.5">{service.description}</p>
                      </div>
                      <span className="text-orange-600 font-bold text-sm ml-4">+S/ {service.price}</span>
                    </label>
                  ))}
                </div>
            </div>

          </div>

          {/* --- Columna de Resumen (lg:col-span-4) --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-neutral-950 rounded-xl p-6 border border-orange-600/30 shadow-2xl shadow-orange-600/5">
                <div className="flex items-center gap-3 mb-6 border-b border-neutral-900 pb-4">
                  <Tag className="h-5 w-5 text-orange-600" />
                  <h3 className="text-xl font-light text-white uppercase tracking-wider">
                    Resumen de Compra
                  </h3>
                </div>

                {calculation ? (
                  <div className="space-y-4">
                    
                    {/* Detalles de la Tarifa */}
                    <div className="space-y-3 pb-4 border-b border-neutral-900">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Tarifa por {period}</span>
                        <span className="text-white font-medium">S/ {calculation.rate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Plan Seleccionado</span>
                        <span className="text-orange-600 font-bold">{calculation.planName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Tiempo de Estancia</span>
                        <span className="text-white font-medium">{calculation.duration}</span>
                      </div>
                    </div>
                    
                    {/* Subtotales */}
                    <div className="space-y-3 pb-4 border-b border-neutral-900">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Costo Base</span>
                        <span className="text-white font-bold">S/ {calculation.basePrice}</span>
                      </div>
                      {parseFloat(calculation.servicesPrice) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Servicios Adicionales</span>
                          <span className="text-orange-600 font-bold">S/ {calculation.servicesPrice}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="pt-2 flex justify-between items-center">
                      <p className="text-lg font-light text-neutral-400 uppercase">Total a Pagar</p>
                      <p className="text-4xl font-extrabold text-orange-600">S/ {calculation.total}</p>
                    </div>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-black font-extrabold py-3 rounded-lg transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
                    >
                      <CreditCard className="h-4 w-4" />
                      Proceder al Pago
                    </button>
                  </div>
                ) : (
                  <p className="text-neutral-600 text-center py-8 text-sm italic font-light">
                    Complete los detalles de la reserva para ver el cálculo del importe.
                  </p>
                )}
              </div>

              {/* Información de Confianza */}
              <div className="mt-6 p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">Nota Importante</p>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    El precio final está sujeto a la hora de salida real y puede variar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal (Responsivo) */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-neutral-950 rounded-xl border border-neutral-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-neutral-600 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-light text-white mb-2 uppercase tracking-wider">
              Pago Seguro
            </h2>
            <p className="text-neutral-500 mb-6 text-sm">
              Ingrese los detalles de su tarjeta para finalizar la reserva.
            </p>

            <div className="space-y-4">
              
              {/* Card Number */}
              <div>
                <label className="text-neutral-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Número de Tarjeta</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  maxLength="19"
                  className="w-full rounded-lg input-minimal"
                />
              </div>

              {/* Card Name */}
              <div>
                <label className="text-neutral-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Nombre del Titular</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="Nombre Apellido"
                  value={paymentData.cardName}
                  onChange={handlePaymentChange}
                  className="w-full rounded-lg input-minimal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="text-neutral-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Vencimiento (MM/YY)</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="01/27"
                    value={paymentData.expiry}
                    onChange={handlePaymentChange}
                    maxLength="5"
                    className="w-full rounded-lg input-minimal"
                  />
                </div>
                {/* CVV */}
                <div>
                  <label className="text-neutral-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    maxLength="3"
                    className="w-full rounded-lg input-minimal"
                  />
                </div>
              </div>

              <div className="bg-orange-600/10 border-l-4 border-orange-600 p-4 mt-6">
                <p className="text-neutral-300 text-sm mb-1.5">Monto Total</p>
                <p className="text-3xl font-extrabold text-white">S/ {calculation?.total}</p>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-black font-extrabold py-3 rounded-lg transition-all text-sm uppercase tracking-widest shadow-lg shadow-orange-600/30"
              >
                Pagar S/ {calculation?.total}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}