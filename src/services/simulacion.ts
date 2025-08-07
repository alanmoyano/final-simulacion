import { exponencial, normal, uniforme } from '@/services/generadores'
import { getParametros } from './parametros'

type Destino = 'pago' | 'actualización' | 'informes'

type Evento =
  | {
      tipo: 'llegada'
      reloj: number
      cliente: Cliente
    }
  | {
      tipo: 'finAtencion'
      reloj: number
      cliente: Cliente
      servidor: Servidor
    }
  | {
      tipo: 'inicializacion'
      reloj: -1
    }
  | {
      tipo: 'finSimulacion'
      reloj: number
    }

type TipoServidor = 'caja' | 'empleado' | 'empleada'

interface Servidor {
  tipo: TipoServidor
  numero: number
  ocupado: boolean
}

type EstadoCliente = 'enCaja' | 'enEmpleado' | 'enEmpleada'

interface Cliente {
  numero: number
  relojLlegada: number
  estado: EstadoCliente
  enCola: boolean
}

function insertarEventoOrdenado(eventos: Evento[], nuevoEvento: Evento): void {
  let inicio = 0
  let fin = eventos.length - 1
  let posicion = eventos.length // posición por defecto (al final)

  // Búsqueda binaria para encontrar la posición correcta
  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2)

    if (eventos[medio].reloj === nuevoEvento.reloj) {
      posicion = medio
      break
    } else if (eventos[medio].reloj < nuevoEvento.reloj) {
      inicio = medio + 1
    } else {
      fin = medio - 1
    }
  }

  // Si no encontramos una posición exacta, usar 'inicio'
  if (inicio > fin) {
    posicion = inicio
  }

  // Insertar en la posición correcta
  eventos.splice(posicion, 0, nuevoEvento)
}

function obtenerServidorLibre(servidores: Servidor[]) {
  return servidores.find(servidor => !servidor.ocupado)
}

export function simulacion(): [number, unknown[]] {
  const parametros = getParametros()

  function destinoCliente() {
    const rndPrimerDestino = Math.random()
    const primerDestino: Destino =
      rndPrimerDestino < parametros.proporcionFacturasVencidas
        ? 'actualización'
        : 'pago'

    let rndSegundoDestino: number | undefined
    let segundoDestino: Destino | undefined

    if (primerDestino === 'actualización') {
      rndSegundoDestino = Math.random()
      segundoDestino =
        rndSegundoDestino < parametros.proporcionActualizacion
          ? 'informes'
          : 'actualización'
    }

    return {
      primerDestino,
      segundoDestino,
      rndPrimerDestino,
      rndSegundoDestino,
    }
  }

  const eventos: Evento[] = []

  eventos.push({
    tipo: 'inicializacion',
    reloj: -1,
  })

  eventos.push({
    tipo: 'finSimulacion',
    reloj: parametros.tiempoSimulacion,
  })

  const colaCajas: Cliente[] = []
  const colaEmpleados: Cliente[] = []
  const colaEmpleadas: Cliente[] = []

  const servidoresCajas: Servidor[] = Array.from(
    { length: parametros.cantidadCajas },
    (_, i) => ({
      tipo: 'caja',
      numero: i + 1,
      ocupado: false,
    }),
  )

  const servidoresEmpleados: Servidor[] = Array.from(
    { length: parametros.cantidadEmpleados },
    (_, i) => ({
      tipo: 'empleado',
      numero: i + 1,
      ocupado: false,
    }),
  )

  const servidoresEmpleadas: Servidor[] = Array.from(
    { length: parametros.cantidadEmpleadas },
    (_, i) => ({
      tipo: 'empleada',
      numero: i + 1,
      ocupado: false,
    }),
  )

  let cantidadClientes = 0

  let acumuladorTiempoEsperaCajas = 0
  let acumuladorPermanencia = 0
  let cantidadClientesEnCaja = 0

  let valoresGuardadosNormal:
    | { rnd1: number; rnd2: number; tiempoGuardado: number }
    | undefined

  // Persistencia de valores de fin de atención por servidor
  const finAtencionCajas: Record<number, number | undefined> = {}
  const finAtencionEmpleados: Record<number, number | undefined> = {}
  const finAtencionN1Empleadas: Record<number, number | undefined> = {}
  const finAtencionN2Empleadas: Record<number, number | undefined> = {}

  let finSimulacion = false

  const filas: unknown[] = []

  while (eventos.length > 0) {
    const evento = eventos.shift() as Evento
    if (finSimulacion) break

    const relojActual = evento.reloj
    const valores: Record<
      string,
      string | Destino | number | undefined | Servidor[]
    > = {
      relojActual,

      colaCajas: colaCajas.length,
      colaEmpleados: colaEmpleados.length,
      colaEmpleadas: colaEmpleadas.length,
    }

    switch (evento.tipo) {
      case 'inicializacion': {
        insertarEventoOrdenado(eventos, {
          tipo: 'llegada',
          reloj: 0,
          cliente: {
            numero: ++cantidadClientes,
            relojLlegada: 0,
            estado: 'enCaja',
            enCola: false,
          },
        })

        break
      }

      case 'llegada': {
        const [rndLlegada, tiempoLlegada] = exponencial(parametros.mediaLlegada)
        const proximaLlegada = relojActual + tiempoLlegada

        valores.rndLlegada = rndLlegada
        valores.tiempoLlegada = tiempoLlegada
        valores.proximaLlegada = proximaLlegada

        if (proximaLlegada <= parametros.tiempoSimulacion) {
          insertarEventoOrdenado(eventos, {
            tipo: 'llegada',
            reloj: proximaLlegada,
            cliente: {
              numero: ++cantidadClientes,
              relojLlegada: proximaLlegada,
              estado: 'enCaja',
              enCola: false,
            },
          })
        }

        const {
          primerDestino,
          segundoDestino,
          rndPrimerDestino,
          rndSegundoDestino,
        } = destinoCliente()

        valores.primerDestino = primerDestino
        valores.segundoDestino = segundoDestino
        valores.rndPrimerDestino = rndPrimerDestino
        valores.rndSegundoDestino = rndSegundoDestino

        if (primerDestino === 'pago') {
          const servidor = obtenerServidorLibre(servidoresCajas)

          if (colaCajas.length > 0 || !servidor) {
            colaCajas.push({
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enCaja',
              enCola: true,
            })

            break
          }

          const [rndCobro, tiempoCobro] = uniforme(
            parametros.minCobro,
            parametros.maxCobro,
          )

          const tiempoFinCobro = tiempoCobro + relojActual

          servidor.ocupado = true

          // Guardar fin de atención para este servidor específico
          finAtencionCajas[servidor.numero] = tiempoFinCobro

          insertarEventoOrdenado(eventos, {
            tipo: 'finAtencion',
            reloj: tiempoFinCobro,
            cliente: {
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enCaja',
              enCola: false,
            },
            servidor,
          })

          valores.rndCobro = rndCobro
          valores.tiempoCobro = tiempoCobro
          valores.tiempoFinCobro = tiempoFinCobro
        } else if (segundoDestino === 'actualización') {
          const servidor = obtenerServidorLibre(servidoresEmpleados)

          if (colaEmpleados.length > 0 || !servidor) {
            colaEmpleados.push({
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enEmpleado',
              enCola: true,
            })

            break
          }

          const [rndActualizacion, tiempoActualizacion] = exponencial(
            parametros.mediaActualizacion,
          )

          const tiempoFinActualizacion = tiempoActualizacion + relojActual

          servidor.ocupado = true

          // Guardar fin de atención para este servidor específico
          finAtencionEmpleados[servidor.numero] = tiempoFinActualizacion

          insertarEventoOrdenado(eventos, {
            tipo: 'finAtencion',
            reloj: tiempoFinActualizacion,
            cliente: {
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enEmpleado',
              enCola: false,
            },
            servidor,
          })

          valores.rndActualizacion = rndActualizacion
          valores.tiempoActualizacion = tiempoActualizacion
          valores.tiempoFinActualizacion = tiempoFinActualizacion

          break
        } else {
          const servidor = obtenerServidorLibre(servidoresEmpleadas)

          if (colaEmpleadas.length > 0 || !servidor) {
            colaEmpleadas.push({
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enEmpleada',
              enCola: true,
            })

            break
          }

          let tiempoFinInformes: number
          if (!valoresGuardadosNormal) {
            const [
              rndInformes1,
              rndInformes2,
              tiempoInformes1,
              tiempoInformes2,
            ] = normal(parametros.mediaInforme, parametros.desviacionInforme)

            tiempoFinInformes = tiempoInformes1 + relojActual

            valoresGuardadosNormal = {
              rnd1: rndInformes1,
              rnd2: rndInformes2,
              tiempoGuardado: tiempoInformes2,
            }

            valores.rndInformes1 = rndInformes1
            valores.rndInformes2 = rndInformes2
            valores.tiempoInformes1 = tiempoInformes1
            valores.tiempoInformes2 = tiempoInformes2
          } else {
            tiempoFinInformes =
              valoresGuardadosNormal.tiempoGuardado + relojActual
            valoresGuardadosNormal = undefined
          }

          servidor.ocupado = true

          // Guardar fin de atención para este servidor específico
          if (valoresGuardadosNormal) {
            finAtencionN1Empleadas[servidor.numero] = tiempoFinInformes
            finAtencionN2Empleadas[servidor.numero] =
              valoresGuardadosNormal.tiempoGuardado + relojActual
          } else {
            finAtencionN2Empleadas[servidor.numero] = tiempoFinInformes
          }

          insertarEventoOrdenado(eventos, {
            tipo: 'finAtencion',
            reloj: tiempoFinInformes,
            cliente: {
              numero: evento.cliente.numero,
              relojLlegada: relojActual,
              estado: 'enEmpleada',
              enCola: false,
            },
            servidor,
          })

          valores.tiempoFinInformes = tiempoFinInformes
        }

        break
      }

      case 'finAtencion': {
        switch (evento.servidor.tipo) {
          case 'caja': {
            acumuladorPermanencia += relojActual - evento.cliente.relojLlegada
            cantidadClientesEnCaja++

            if (colaCajas.length === 0) {
              evento.servidor.ocupado = false
              // Limpiar el fin de atención para este servidor
              finAtencionCajas[evento.servidor.numero] = undefined

              break
            }

            const nuevoCliente = colaCajas.shift() as Cliente
            nuevoCliente.enCola = false

            acumuladorTiempoEsperaCajas +=
              relojActual - nuevoCliente.relojLlegada

            const [rndCobro, tiempoCobro] = uniforme(
              parametros.minCobro,
              parametros.maxCobro,
            )

            const tiempoFinCobro = tiempoCobro + relojActual
            evento.servidor.ocupado = true

            // Actualizar fin de atención para este servidor específico
            finAtencionCajas[evento.servidor.numero] = tiempoFinCobro

            insertarEventoOrdenado(eventos, {
              tipo: 'finAtencion',
              reloj: tiempoFinCobro,
              cliente: nuevoCliente,
              servidor: evento.servidor,
            })

            valores.rndCobro = rndCobro
            valores.tiempoCobro = tiempoCobro
            valores.tiempoFinCobro = tiempoFinCobro

            break
          }

          case 'empleado': {
            evento.cliente.estado = 'enCaja'
            evento.cliente.enCola = true

            colaCajas.push(evento.cliente)

            if (colaEmpleados.length === 0) {
              evento.servidor.ocupado = false
              // Limpiar el fin de atención para este servidor
              finAtencionEmpleados[evento.servidor.numero] = undefined

              break
            }

            const nuevoCliente = colaEmpleados.shift() as Cliente
            nuevoCliente.enCola = false

            const [rndActualizacion, tiempoActualizacion] = exponencial(
              parametros.mediaActualizacion,
            )

            const tiempoFinActualizacion = tiempoActualizacion + relojActual

            evento.servidor.ocupado = true

            // Actualizar fin de atención para este servidor específico
            finAtencionEmpleados[evento.servidor.numero] =
              tiempoFinActualizacion

            insertarEventoOrdenado(eventos, {
              tipo: 'finAtencion',
              reloj: tiempoFinActualizacion,
              cliente: nuevoCliente,
              servidor: evento.servidor,
            })

            valores.rndActualizacion = rndActualizacion
            valores.tiempoActualizacion = tiempoActualizacion
            valores.tiempoFinActualizacion = tiempoFinActualizacion

            break
          }

          case 'empleada': {
            evento.cliente.estado = 'enEmpleado'
            evento.cliente.enCola = true

            colaEmpleados.push(evento.cliente)

            if (colaEmpleadas.length === 0) {
              evento.servidor.ocupado = false
              // Limpiar el fin de atención para este servidor
              finAtencionN1Empleadas[evento.servidor.numero] = undefined
              finAtencionN2Empleadas[evento.servidor.numero] = undefined

              break
            }

            const nuevoCliente = colaEmpleadas.shift() as Cliente
            nuevoCliente.enCola = false

            let tiempoFinInformes: number
            if (!valoresGuardadosNormal) {
              const [
                rndInformes1,
                rndInformes2,
                tiempoInformes1,
                tiempoInformes2,
              ] = normal(parametros.mediaInforme, parametros.desviacionInforme)

              tiempoFinInformes = tiempoInformes1 + relojActual

              valoresGuardadosNormal = {
                rnd1: rndInformes1,
                rnd2: rndInformes2,
                tiempoGuardado: tiempoInformes2,
              }

              valores.rndInformes1 = rndInformes1
              valores.rndInformes2 = rndInformes2
              valores.tiempoInformes1 = tiempoInformes1
              valores.tiempoInformes2 = tiempoInformes2
            } else {
              tiempoFinInformes =
                valoresGuardadosNormal.tiempoGuardado + relojActual

              valoresGuardadosNormal = undefined
            }

            evento.servidor.ocupado = true

            // Actualizar fin de atención para este servidor específico
            if (valoresGuardadosNormal) {
              finAtencionN1Empleadas[evento.servidor.numero] = tiempoFinInformes
              finAtencionN2Empleadas[evento.servidor.numero] =
                valoresGuardadosNormal.tiempoGuardado + relojActual
            } else {
              finAtencionN2Empleadas[evento.servidor.numero] = tiempoFinInformes
            }

            insertarEventoOrdenado(eventos, {
              tipo: 'finAtencion',
              reloj: tiempoFinInformes,
              cliente: nuevoCliente,
              servidor: evento.servidor,
            })

            valores.tiempoFinInformes = tiempoFinInformes

            break
          }
        }

        break
      }

      case 'finSimulacion': {
        console.log('Fin Simulacion')

        finSimulacion = true

        break
      }
    }

    valores.evento = `${evento.tipo}${
      evento.tipo === 'llegada' || evento.tipo === 'finAtencion'
        ? ` cliente: ${evento.cliente.numero}`
        : ''
    }`

    valores.acumuladorTiempoEsperaCajas = acumuladorTiempoEsperaCajas
    valores.acumuladorPermanencia = acumuladorPermanencia
    valores.cantidadClientesEnCaja = cantidadClientesEnCaja

    valores.promedioTiempoEsperaCajas =
      cantidadClientesEnCaja > 0
        ? acumuladorTiempoEsperaCajas / cantidadClientesEnCaja
        : 0

    valores.promedioPermanencia =
      cantidadClientesEnCaja > 0
        ? acumuladorPermanencia / cantidadClientesEnCaja
        : 0

    valores.servidoresCajas = servidoresCajas
    valores.servidoresEmpleados = servidoresEmpleados
    valores.servidoresEmpleadas = servidoresEmpleadas

    // Asignar valores de fin de atención por servidor dinámicamente
    for (let i = 1; i <= parametros.cantidadCajas; i++) {
      valores[`finAtencionCaja${i}`] = finAtencionCajas[i]
    }
    for (let i = 1; i <= parametros.cantidadEmpleados; i++) {
      valores[`finAtencionEmpleado${i}`] = finAtencionEmpleados[i]
    }
    for (let i = 1; i <= parametros.cantidadEmpleadas; i++) {
      valores[`finAtencionN1Empleada${i}`] = finAtencionN1Empleadas[i]
      valores[`finAtencionN2Empleada${i}`] = finAtencionN2Empleadas[i]
    }

    // console.log(`${evento.reloj}`, valores)
    // console.log(evento.reloj, eventos)

    // console.log(relojActual)
    filas.push(valores)
  }

  return [filas.length, filas]
}
