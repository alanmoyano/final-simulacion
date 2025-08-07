interface Servidor {
  tipo: 'caja' | 'empleado' | 'empleada'
  numero: number
  ocupado: boolean
}

// Tipo de retorno de la función simulación
export type ResultadoSimulacion = [number, SimulacionRow[]]

// Re-exportar tipos necesarios
export type { Servidor }

interface Servidor {
  tipo: 'caja' | 'empleado' | 'empleada'
  numero: number
  ocupado: boolean
}

export type SimulacionRow = {
  // Control (Header padre)
  control?: {
    relojActual?: number
    evento?: string
  }

  // Llegada (Header padre)
  llegada?: {
    rnd?: number
    tiempo?: number
    proximaLlegada?: number
  }

  // Atención cajas (Header padre)
  atencionCajas?: {
    rnd?: number
    tiempo?: number
    finAtencion?: number
    // Fin atención por caja individual (se calcularían dinámicamente según cantidadCajas)
    finAtencionCaja1?: number
    finAtencionCaja2?: number
    finAtencionCaja3?: number
    finAtencionCaja4?: number
  }

  // Atención actualización (Header padre)
  atencionActualizacion?: {
    rnd?: number
    tiempo?: number
    finAtencion?: number
    // Fin atención por empleado (se calcularían dinámicamente según cantidadEmpleados)
    finAtencionEmpleado1?: number
  }

  // Atención informes (Header padre)
  atencionInformes?: {
    rnd1?: number
    rnd2?: number
    tiempo?: number
    finAtencionN1?: number
    finAtencionN2?: number
    // Fin atención por empleada (se calcularían dinámicamente según cantidadEmpleadas)
    finAtencionN1Empleada1?: number
    finAtencionN2Empleada1?: number
  }

  // Primer destino (Header padre)
  primerDestinoData?: {
    rnd?: number
    destino?: 'pago' | 'actualización'
  }

  // Segundo destino (Header padre)
  segundoDestinoData?: {
    rnd?: number
    destino?: 'actualización' | 'informes'
  }

  // Colas (Header padre)
  colas?: {
    colaCajas?: number
    colaActualizacion?: number
    colaInformes?: number
  }

  // Estadística (Header padre)
  estadistica?: {
    acumuladorTiempoEsperaCajas?: number
    acumuladorTiempoPermanencia?: number
    totalPersonasAtendidasCaja?: number
    promedioTiempoEsperaCajas?: number
    promedioTiempoPermanencia?: number
  }

  // Servidores (Header padre)
  servidores?: {
    // Arrays completos
    servidoresCajas?: Servidor[]
    servidoresEmpleados?: Servidor[]
    servidoresEmpleadas?: Servidor[]
    // Estados individuales (se extraerían de los arrays)
    estadoCaja1?: boolean
    estadoCaja2?: boolean
    estadoCaja3?: boolean
    estadoCaja4?: boolean
    estadoEmpleado1?: boolean
    estadoEmpleada1?: boolean
  }

  // DEPRECATED: Campos planos para compatibilidad con la función actual
  relojActual?: number
  evento?: string
  rndLlegada?: number
  tiempoLlegada?: number
  proximaLlegada?: number
  primerDestino?: 'pago' | 'actualización'
  segundoDestino?: 'actualización' | 'informes'
  rndPrimerDestino?: number
  rndSegundoDestino?: number
  rndCobro?: number
  tiempoCobro?: number
  tiempoFinCobro?: number
  rndActualizacion?: number
  tiempoActualizacion?: number
  tiempoFinActualizacion?: number
  rndInformes1?: number
  rndInformes2?: number
  tiempoInformes1?: number
  tiempoInformes2?: number
  tiempoFinInformes?: number
  colaCajas?: number
  colaEmpleados?: number
  colaEmpleadas?: number
  servidoresCajas?: Servidor[]
  servidoresEmpleados?: Servidor[]
  servidoresEmpleadas?: Servidor[]
  acumuladorTiempoEsperaCajas?: number
  acumuladorPermanencia?: number
  // Nuevos valores que SÍ están en simulacion.ts
  promedioTiempoEsperaCajas?: number
  promedioPermanencia?: number
  cantidadClientesEnCaja?: number
} & {
  // Permitir campos dinámicos para cualquier cantidad de servidores
  [K in `finAtencionCaja${number}`]?: number
} & {
  [K in `finAtencionEmpleado${number}`]?: number
} & {
  [K in `finAtencionN1Empleada${number}`]?: number
} & {
  [K in `finAtencionN2Empleada${number}`]?: number
}
