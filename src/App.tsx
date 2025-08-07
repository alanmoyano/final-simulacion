import { useState } from 'react'
import { simulacion } from './services/simulacion'
import { Config, type ConfiguracionSimulacion } from '@/components/config'
import { VectorEstado } from '@/components/vector-estado'
// import { Stats } from '@/components/stats'
import type { SimulacionRow } from '@/types/simulacion'
import { configurarParametros } from '@/services/parametros'

function App() {
  const [datosSimulacion, setDatosSimulacion] = useState<SimulacionRow[]>([])
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionSimulacion | null>(null)
  const [simulando, setSimulando] = useState(false)

  const handleSimular = async (config: ConfiguracionSimulacion) => {
    setSimulando(true)
    setConfiguracion(config)
    configurarParametros(config)

    try {
      // Simulamos un pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 100))

      const startTime = new Date()
      const [, filas] = simulacion()
      const endTime = new Date()
      const executionTime = endTime.getTime() - startTime.getTime()

      console.log(`Execution time: ${executionTime} milliseconds`)

      setDatosSimulacion(filas as SimulacionRow[])
    } catch (error) {
      console.error('Error en la simulación:', error)
    } finally {
      setSimulando(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold text-gray-800 tracking-tight'>
            Simulación de Sistema de Colas
          </h1>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
            Sistema de simulación para análisis de colas en servicios bancarios
            con múltiples tipos de atención
          </p>
        </div>

        {/* Configuración */}
        <Config onSimular={handleSimular} simulando={simulando} />

        {/* Resultados */}
        {datosSimulacion.length > 0 && configuracion && (
          <div className='space-y-8'>
            {/* Estadísticas
            <Stats
              datos={datosSimulacion}
              tiempoSimulacion={configuracion.tiempoSimulacion}
            /> */}
            {/* Vector de Estado */}
            <VectorEstado
              datos={datosSimulacion}
              cantidadCajas={configuracion.cantidadCajas}
              cantidadEmpleados={configuracion.cantidadEmpleados}
              cantidadEmpleadas={configuracion.cantidadEmpleadas}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
