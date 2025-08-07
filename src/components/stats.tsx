import { Card } from '@/components/ui/card'
import type { SimulacionRow } from '@/types/simulacion'
import { Clock, Users, Timer, TrendingUp, Calculator, BarChart3 } from 'lucide-react'

interface StatsProps {
  datos: SimulacionRow[]
  tiempoSimulacion: number
}

interface Estadistica {
  titulo: string
  valor: string | number
  descripcion: string
  icono: React.ReactNode
  color: string
}

export function Stats({ datos, tiempoSimulacion }: StatsProps) {
  // Por ahora mostraremos estadísticas básicas ya que las estadísticas detalladas
  // aún no están implementadas en la simulación
  const calcularEstadisticas = (): Estadistica[] => {
    if (datos.length === 0) {
      return []
    }

    const ultimaFila = datos[datos.length - 1]
    const totalEventos = datos.length
    const tiempoFinal = ultimaFila.relojActual || 0

    // Contar tipos de eventos (aproximado basado en datos disponibles)
    const eventosLlegada = datos.filter(fila => fila.rndLlegada !== undefined).length
    const eventosAtencion = datos.filter(fila => 
      fila.tiempoFinCobro !== undefined || 
      fila.tiempoFinActualizacion !== undefined || 
      fila.tiempoFinInformes !== undefined
    ).length

    // Calcular promedios de colas
    const promedioColaCajas = datos.reduce((sum, fila) => sum + (fila.colaCajas || 0), 0) / datos.length
    const promedioColaEmpleados = datos.reduce((sum, fila) => sum + (fila.colaEmpleados || 0), 0) / datos.length
    const promedioColaEmpleadas = datos.reduce((sum, fila) => sum + (fila.colaEmpleadas || 0), 0) / datos.length

    // Calcular utilización de servidores (aproximada)
    let utilizacionCajas = 0
    let utilizacionEmpleados = 0 
    let utilizacionEmpleadas = 0

    if (ultimaFila.servidoresCajas) {
      utilizacionCajas = ultimaFila.servidoresCajas.filter(s => s.ocupado).length / ultimaFila.servidoresCajas.length
    }
    if (ultimaFila.servidoresEmpleados) {
      utilizacionEmpleados = ultimaFila.servidoresEmpleados.filter(s => s.ocupado).length / ultimaFila.servidoresEmpleados.length
    }
    if (ultimaFila.servidoresEmpleadas) {
      utilizacionEmpleadas = ultimaFila.servidoresEmpleadas.filter(s => s.ocupado).length / ultimaFila.servidoresEmpleadas.length
    }

    return [
      {
        titulo: 'Tiempo Simulado',
        valor: `${tiempoFinal.toFixed(2)} seg`,
        descripcion: 'Tiempo total de la simulación',
        icono: <Clock className='h-5 w-5' />,
        color: 'blue'
      },
      {
        titulo: 'Total de Eventos',
        valor: totalEventos,
        descripcion: 'Eventos procesados en la simulación',
        icono: <Calculator className='h-5 w-5' />,
        color: 'green'
      },
      {
        titulo: 'Llegadas de Clientes',
        valor: eventosLlegada,
        descripcion: 'Clientes que llegaron al sistema',
        icono: <Users className='h-5 w-5' />,
        color: 'purple'
      },
      {
        titulo: 'Eventos de Atención',
        valor: eventosAtencion,
        descripcion: 'Finalizaciones de servicio',
        icono: <Timer className='h-5 w-5' />,
        color: 'orange'
      },
      {
        titulo: 'Promedio Cola Cajas',
        valor: promedioColaCajas.toFixed(2),
        descripcion: 'Clientes promedio esperando en cajas',
        icono: <BarChart3 className='h-5 w-5' />,
        color: 'yellow'
      },
      {
        titulo: 'Promedio Cola Empleados',
        valor: promedioColaEmpleados.toFixed(2),
        descripcion: 'Clientes promedio en cola de empleados',
        icono: <BarChart3 className='h-5 w-5' />,
        color: 'indigo'
      },
      {
        titulo: 'Promedio Cola Empleadas',
        valor: promedioColaEmpleadas.toFixed(2),
        descripcion: 'Clientes promedio en cola de empleadas',
        icono: <BarChart3 className='h-5 w-5' />,
        color: 'pink'
      },
      {
        titulo: 'Utilización Cajas',
        valor: `${(utilizacionCajas * 100).toFixed(1)}%`,
        descripcion: 'Porcentaje de cajas ocupadas',
        icono: <TrendingUp className='h-5 w-5' />,
        color: 'red'
      },
      {
        titulo: 'Utilización Empleados',
        valor: `${(utilizacionEmpleados * 100).toFixed(1)}%`,
        descripcion: 'Porcentaje de empleados ocupados',
        icono: <TrendingUp className='h-5 w-5' />,
        color: 'teal'
      },
      {
        titulo: 'Utilización Empleadas',
        valor: `${(utilizacionEmpleadas * 100).toFixed(1)}%`,
        descripcion: 'Porcentaje de empleadas ocupadas',
        icono: <TrendingUp className='h-5 w-5' />,
        color: 'cyan'
      }
    ]
  }

  const estadisticas = calcularEstadisticas()

  const obtenerColorClases = (color: string) => {
    const colores = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      teal: 'bg-teal-50 border-teal-200 text-teal-700',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700'
    }
    return colores[color as keyof typeof colores] || colores.blue
  }

  if (datos.length === 0) {
    return (
      <Card className='p-8 text-center bg-gray-50'>
        <p className='text-gray-500'>No hay datos para calcular estadísticas</p>
      </Card>
    )
  }

  return (
    <Card className='p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'>
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
            Estadísticas de la Simulación
          </h2>
          <p className='text-gray-600 text-sm'>
            Métricas de rendimiento del sistema de colas
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {estadisticas.map((stat, index) => (
            <Card
              key={index}
              className={`p-4 border-2 ${obtenerColorClases(stat.color)} transition-all hover:shadow-md`}
            >
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-white/50'>
                  {stat.icono}
                </div>
                <div className='flex-1'>
                  <p className='text-sm font-medium opacity-80'>{stat.titulo}</p>
                  <p className='text-2xl font-bold font-mono'>{stat.valor}</p>
                  <p className='text-xs opacity-70 mt-1'>{stat.descripcion}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <div className='border-t pt-4'>
          <h3 className='text-lg font-medium text-gray-700 mb-3'>Información del Sistema</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div className='bg-white/50 p-3 rounded-lg border'>
              <p className='font-medium text-gray-600'>Configuración</p>
              <p className='text-gray-500'>
                {datos[0]?.servidoresCajas?.length || 0} cajas, {' '}
                {datos[0]?.servidoresEmpleados?.length || 0} empleados, {' '}
                {datos[0]?.servidoresEmpleadas?.length || 0} empleadas
              </p>
            </div>
            <div className='bg-white/50 p-3 rounded-lg border'>
              <p className='font-medium text-gray-600'>Estado Final</p>
              <p className='text-gray-500'>
                Cola cajas: {datos[datos.length - 1]?.colaCajas || 0}, {' '}
                Empleados: {datos[datos.length - 1]?.colaEmpleados || 0}, {' '}
                Empleadas: {datos[datos.length - 1]?.colaEmpleadas || 0}
              </p>
            </div>
            <div className='bg-white/50 p-3 rounded-lg border'>
              <p className='font-medium text-gray-600'>Rendimiento</p>
              <p className='text-gray-500'>
                {(datos.length / (tiempoSimulacion / 3600)).toFixed(2)} eventos/hora
              </p>
            </div>
          </div>
        </div>

        <div className='text-center text-sm text-gray-500 italic'>
          * Las estadísticas detalladas se mostrarán cuando estén implementadas en la simulación
        </div>
      </div>
    </Card>
  )
}