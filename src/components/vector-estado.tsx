import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { SimulacionRow } from '@/types/simulacion'
import { headers } from '../../headers'
import { useState } from 'react'

interface VectorEstadoProps {
  datos: SimulacionRow[]
  cantidadCajas: number
  cantidadEmpleados: number
  cantidadEmpleadas: number
}

export function VectorEstado({
  datos,
  cantidadCajas,
  cantidadEmpleados,
  cantidadEmpleadas,
}: VectorEstadoProps) {
  const [filasMedio, setFilasMedio] = useState(10)

  // Generar columnas dinámicamente basadas en headers.ts
  const generarColumnas = () => {
    const columnas: Array<{ key: string; titulo: string; grupo?: string }> = []

    headers.forEach(header => {
      if ('children' in header) {
        header.children.forEach(child => {
          if (child.repeat) {
            // Manejar columnas repetidas
            if (child.name.includes('$numeroCaja')) {
              for (let i = 1; i <= cantidadCajas; i++) {
                columnas.push({
                  key: `${child.name.replace('$numeroCaja', i.toString())}`,
                  titulo: child.name.replace('$numeroCaja', i.toString()),
                  grupo: header.name,
                })
              }
            } else if (child.name.includes('$numeroEmpleado')) {
              for (let i = 1; i <= cantidadEmpleados; i++) {
                columnas.push({
                  key: `${child.name.replace('$numeroEmpleado', i.toString())}`,
                  titulo: child.name.replace('$numeroEmpleado', i.toString()),
                  grupo: header.name,
                })
              }
            } else if (child.name.includes('$numeroEmpleada')) {
              for (let i = 1; i <= cantidadEmpleadas; i++) {
                columnas.push({
                  key: `${child.name.replace('$numeroEmpleada', i.toString())}`,
                  titulo: child.name.replace('$numeroEmpleada', i.toString()),
                  grupo: header.name,
                })
              }
            }
          } else {
            // Mapear nombres de headers a keys de datos
            const keyMap: Record<string, string> = {
              Reloj: 'relojActual',
              Evento: 'evento',
              rnd:
                header.name === 'Llegada'
                  ? 'rndLlegada'
                  : header.name === 'Primer destino'
                    ? 'rndPrimerDestino'
                    : header.name === 'Segundo destino'
                      ? 'rndSegundoDestino'
                      : header.name === 'Atención cajas'
                        ? 'rndCobro'
                        : header.name === 'Atención actualización'
                          ? 'rndActualizacion'
                          : 'rndInformes1',
              Tiempo:
                header.name === 'Llegada'
                  ? 'tiempoLlegada'
                  : header.name === 'Atención cajas'
                    ? 'tiempoCobro'
                    : header.name === 'Atención actualización'
                      ? 'tiempoActualizacion'
                      : 'tiempoInformes1',
              'Proxima llegada': 'proximaLlegada',
              destino:
                header.name === 'Primer destino'
                  ? 'primerDestino'
                  : 'segundoDestino',
              'Cola cajas': 'colaCajas',
              'Cola actualización': 'colaEmpleados',
              'Cola informes': 'colaEmpleadas',
              rnd1: 'rndInformes1',
              rnd2: 'rndInformes2',
              'Acumulador tiempo de espera en cajas':
                'acumuladorTiempoEsperaCajas',
              'Acumulador tiempo de permanencia': 'acumuladorPermanencia',
              'Total personas atendidas en caja': 'cantidadClientesEnCaja',
              'Promedio tiempo de espera en cajas': 'promedioTiempoEsperaCajas',
              'Promedio tiempo de permanencia': 'promedioPermanencia',
            }

            columnas.push({
              key:
                keyMap[child.name] || child.name.toLowerCase().replace(' ', ''),
              titulo: child.name,
              grupo: header.name,
            })
          }
        })
      }
    })

    return columnas
  }

  const columnas = generarColumnas()

  // Lógica para mostrar primeros 10, medio configurables, últimos 10
  const obtenerFilasAMostrar = () => {
    if (datos.length <= 20) {
      // Si hay 20 o menos filas, mostrar todas
      return datos.map((fila, indice) => ({
        ...fila,
        indice,
        tipo: 'normal' as const,
      }))
    }

    const primeras10 = datos.slice(0, 10).map((fila, indice) => ({
      ...fila,
      indice,
      tipo: 'normal' as const,
    }))

    const ultimas10 = datos.slice(-10).map((fila, indice) => ({
      ...fila,
      indice: datos.length - 10 + indice,
      tipo: 'normal' as const,
    }))

    // Filas del medio
    const inicioMedio = 10
    const finMedio = Math.min(10 + filasMedio, datos.length - 10)
    const filasMedioSeleccionadas = datos
      .slice(inicioMedio, finMedio)
      .map((fila, indice) => ({
        ...fila,
        indice: inicioMedio + indice,
        tipo: 'normal' as const,
      }))

    const resultado = [
      ...primeras10,
      // Fila separadora entre primeras y medio
      { tipo: 'separador' as const, indice: -1 },
      ...filasMedioSeleccionadas,
      // Fila separadora entre medio y últimas
      { tipo: 'separador' as const, indice: -2 },
      ...ultimas10,
    ]

    return resultado
  }

  const filasAMostrar = obtenerFilasAMostrar()

  const obtenerValorCelda = (fila: SimulacionRow, key: string) => {
    // Manejar casos especiales para fin de atención por servidor
    if (key.startsWith('Fin atención ') && !key.includes('(')) {
      const numeroCaja = parseInt(key.replace('Fin atención ', ''))
      const finAtencionKey =
        `finAtencionCaja${numeroCaja}` as keyof SimulacionRow
      const valor = fila[finAtencionKey]
      return valor !== undefined ? Number(valor).toFixed(3) : '-'
    }

    if (key.startsWith('Fin atención ') && key.includes('$numeroEmpleado')) {
      const numeroEmpleado = parseInt(key.replace('Fin atención ', ''))
      const finAtencionKey =
        `finAtencionEmpleado${numeroEmpleado}` as keyof SimulacionRow
      const valor = fila[finAtencionKey]
      return valor !== undefined ? Number(valor).toFixed(3) : '-'
    }

    if (key.startsWith('Fin atención (n1)')) {
      const numeroEmpleada = parseInt(key.replace('Fin atención (n1) ', ''))
      const finAtencionKey =
        `finAtencionN1Empleada${numeroEmpleada}` as keyof SimulacionRow
      const valor = fila[finAtencionKey]
      return valor !== undefined ? Number(valor).toFixed(3) : '-'
    }

    if (key.startsWith('Fin atención (n2)')) {
      const numeroEmpleada = parseInt(key.replace('Fin atención (n2) ', ''))
      const finAtencionKey =
        `finAtencionN2Empleada${numeroEmpleada}` as keyof SimulacionRow
      const valor = fila[finAtencionKey]
      return valor !== undefined ? Number(valor).toFixed(3) : '-'
    }

    // Manejar casos especiales para servidores
    if (key.startsWith('Estado caja')) {
      const numeroCaja = parseInt(key.replace('Estado caja ', ''))
      const servidor = (fila.servidoresCajas || []).find(
        s => s.numero === numeroCaja,
      )
      return servidor ? (servidor.ocupado ? 'Ocupado' : 'Libre') : '-'
    }

    if (key.startsWith('Estado empleado')) {
      const numeroEmpleado = parseInt(key.replace('Estado empleado ', ''))
      const servidor = (fila.servidoresEmpleados || []).find(
        s => s.numero === numeroEmpleado,
      )
      return servidor ? (servidor.ocupado ? 'Ocupado' : 'Libre') : '-'
    }

    if (key.startsWith('Estado empleada')) {
      const numeroEmpleada = parseInt(key.replace('Estado empleada ', ''))
      const servidor = (fila.servidoresEmpleadas || []).find(
        s => s.numero === numeroEmpleada,
      )
      return servidor ? (servidor.ocupado ? 'Ocupado' : 'Libre') : '-'
    }

    const valor = (fila as Record<string, unknown>)[key]

    if (valor === undefined || valor === null) return '-'
    if (typeof valor === 'number') return valor.toFixed(3)
    return valor.toString()
  }

  const obtenerColorGrupo = (grupo: string) => {
    const colores = {
      Control: 'bg-blue-50 border-blue-200',
      Llegada: 'bg-green-50 border-green-200',
      'Atención cajas': 'bg-yellow-50 border-yellow-200',
      'Atención actualización': 'bg-purple-50 border-purple-200',
      'Atención informes': 'bg-pink-50 border-pink-200',
      'Primer destino': 'bg-orange-50 border-orange-200',
      'Segundo destino': 'bg-red-50 border-red-200',
      Colas: 'bg-indigo-50 border-indigo-200',
      Estadística: 'bg-gray-50 border-gray-200',
      Servidores: 'bg-teal-50 border-teal-200',
    }
    return (
      colores[grupo as keyof typeof colores] || 'bg-gray-50 border-gray-200'
    )
  }

  if (datos.length === 0) {
    return (
      <Card className='p-8 text-center bg-gray-50'>
        <p className='text-gray-500'>No hay datos de simulación para mostrar</p>
      </Card>
    )
  }

  return (
    <Card className='p-6 bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200'>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Vector de Estado
            </h2>
            <p className='text-gray-600 text-sm'>
              {datos.length} eventos simulados
            </p>
          </div>

          {datos.length > 20 && (
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-600'>Filas del medio:</label>
              <Input
                type='number'
                min='0'
                max={Math.max(0, datos.length - 20)}
                value={filasMedio}
                onChange={e =>
                  setFilasMedio(Math.max(0, parseInt(e.target.value) || 0))
                }
                className='w-20 text-sm'
              />
            </div>
          )}
        </div>

        <div className='border rounded-lg overflow-hidden'>
          <div className='h-[600px] overflow-auto'>
            <Table>
              <TableHeader className='sticky top-0 bg-white z-10'>
                <TableRow>
                  <TableHead className='bg-gray-100 border-r font-semibold text-gray-700'>
                    #
                  </TableHead>
                  {columnas.map((columna, index) => (
                    <TableHead
                      key={index}
                      className={`${obtenerColorGrupo(columna.grupo || '')} font-semibold text-gray-700 text-xs px-2 min-w-[80px] whitespace-nowrap`}
                    >
                      {columna.titulo}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filasAMostrar.map(item => {
                  if (item.tipo === 'separador') {
                    return (
                      <TableRow
                        key={`separador-${item.indice}`}
                        className='bg-gray-100'
                      >
                        <TableCell className='text-center text-gray-500 font-medium py-3'>
                          ⋯
                        </TableCell>
                        {columnas.map((_, colIdx) => (
                          <TableCell
                            key={colIdx}
                            className='text-center text-gray-400 py-3'
                          >
                            ⋯
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  }

                  return (
                    <TableRow key={item.indice} className='hover:bg-blue-50/50'>
                      <TableCell className='font-mono text-xs bg-gray-50 border-r font-medium'>
                        {item.indice + 1}
                      </TableCell>
                      {columnas.map((columna, index) => (
                        <TableCell
                          key={index}
                          className='font-mono text-xs px-2 text-center'
                        >
                          {obtenerValorCelda(
                            item as SimulacionRow,
                            columna.key,
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {datos.length > 20 && (
          <div className='text-center text-sm text-gray-500'>
            Mostrando: primeras 10 + {filasMedio} del medio + últimas 10 filas (
            {10 + filasMedio + 10} de {datos.length} total)
          </div>
        )}
      </div>
    </Card>
  )
}
