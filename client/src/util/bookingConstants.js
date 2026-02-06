import { Car, Truck, Bike } from "lucide-react"

export const vehicleTypes = [
  { value: "auto", label: "Automóvil", icon: Car },
  { value: "camion", label: "Camión / Van", icon: Truck },
  { value: "moto", label: "Motocicleta", icon: Bike },
]

export const typeVehiculoMap = {
  "auto": 1,
  "camion": 2,
  "moto": 3,
}

export const periods = [
  { id: "hora", label: "Por Hora" },
  { id: "dia", label: "Por Día" },
  { id: "semana", label: "Por Semana" },
]
