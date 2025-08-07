import type { ConfiguracionSimulacion } from '@/components/config'

let parametros = {
  tiempoSimulacion: 50_000,

  mediaLlegada: 60,

  proporcionFacturasVencidas: 0.4,
  cantidadCajas: 4,
  minCobro: 25,
  maxCobro: 30,

  cantidadEmpleados: 1,
  proporcionActualizacion: 0.75,
  mediaActualizacion: 40,

  cantidadEmpleadas: 1,
  mediaInforme: 20,
  desviacionInforme: 2,
}

export function configurarParametros(config: ConfiguracionSimulacion) {
  parametros = {
    ...parametros,
    ...config,
  }
}

export function getParametros() {
  return parametros
}
