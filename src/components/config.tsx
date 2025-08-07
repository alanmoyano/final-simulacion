import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { getParametros } from '@/services/parametros'

export interface ConfiguracionSimulacion {
  tiempoSimulacion: number
  mediaLlegada: number
  proporcionFacturasVencidas: number
  cantidadCajas: number
  minCobro: number
  maxCobro: number
  cantidadEmpleados: number
  proporcionActualizacion: number
  mediaActualizacion: number
  cantidadEmpleadas: number
  mediaInforme: number
  desviacionInforme: number
}

interface ConfigProps {
  onSimular: (config: ConfiguracionSimulacion) => void
  simulando: boolean
}

export function Config({ onSimular, simulando }: ConfigProps) {
  const parametros = getParametros()

  const [config, setConfig] = useState<ConfiguracionSimulacion>({
    tiempoSimulacion: parametros.tiempoSimulacion,
    mediaLlegada: parametros.mediaLlegada,
    proporcionFacturasVencidas: parametros.proporcionFacturasVencidas,
    cantidadCajas: parametros.cantidadCajas,
    minCobro: parametros.minCobro,
    maxCobro: parametros.maxCobro,
    cantidadEmpleados: parametros.cantidadEmpleados,
    proporcionActualizacion: parametros.proporcionActualizacion,
    mediaActualizacion: parametros.mediaActualizacion,
    cantidadEmpleadas: parametros.cantidadEmpleadas,
    mediaInforme: parametros.mediaInforme,
    desviacionInforme: parametros.desviacionInforme,
  })

  const handleInputChange =
    (field: keyof ConfiguracionSimulacion) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0
      setConfig(prev => ({ ...prev, [field]: value }))
    }

  const handleSimular = () => {
    onSimular(config)
  }

  return (
    <Card className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'>
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
            Configuración de Simulación
          </h2>
          <p className='text-gray-600 text-sm'>
            Ajusta los parámetros del sistema de colas
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Configuración General */}
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-700 border-b border-gray-300 pb-2'>
              General
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Tiempo de Simulación (seg)
                </label>
                <Input
                  type='number'
                  value={config.tiempoSimulacion}
                  onChange={handleInputChange('tiempoSimulacion')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Media de Llegada (seg)
                </label>
                <Input
                  type='number'
                  value={config.mediaLlegada}
                  onChange={handleInputChange('mediaLlegada')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Proporción Facturas Vencidas
                </label>
                <Input
                  type='number'
                  step='0.01'
                  min='0'
                  max='1'
                  value={config.proporcionFacturasVencidas}
                  onChange={handleInputChange('proporcionFacturasVencidas')}
                  className='font-mono'
                />
              </div>
            </div>
          </div>

          {/* Configuración Cajas */}
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-700 border-b border-gray-300 pb-2'>
              Cajas de Cobro
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Cantidad de Cajas
                </label>
                <Input
                  type='number'
                  min='1'
                  value={config.cantidadCajas}
                  onChange={handleInputChange('cantidadCajas')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Tiempo Mínimo Cobro (seg)
                </label>
                <Input
                  type='number'
                  value={config.minCobro}
                  onChange={handleInputChange('minCobro')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Tiempo Máximo Cobro (seg)
                </label>
                <Input
                  type='number'
                  value={config.maxCobro}
                  onChange={handleInputChange('maxCobro')}
                  className='font-mono'
                />
              </div>
            </div>
          </div>

          {/* Configuración Empleados */}
          <div className='space-y-4'>
            <h3 className='font-medium text-gray-700 border-b border-gray-300 pb-2'>
              Empleados y Empleadas
            </h3>
            <div className='space-y-3'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Cantidad Empleados
                </label>
                <Input
                  type='number'
                  min='1'
                  value={config.cantidadEmpleados}
                  onChange={handleInputChange('cantidadEmpleados')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Proporción Actualización
                </label>
                <Input
                  type='number'
                  step='0.01'
                  min='0'
                  max='1'
                  value={config.proporcionActualizacion}
                  onChange={handleInputChange('proporcionActualizacion')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Media Actualización (seg)
                </label>
                <Input
                  type='number'
                  value={config.mediaActualizacion}
                  onChange={handleInputChange('mediaActualizacion')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Cantidad Empleadas
                </label>
                <Input
                  type='number'
                  min='1'
                  value={config.cantidadEmpleadas}
                  onChange={handleInputChange('cantidadEmpleadas')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Media Informe (seg)
                </label>
                <Input
                  type='number'
                  value={config.mediaInforme}
                  onChange={handleInputChange('mediaInforme')}
                  className='font-mono'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Desviación Informe
                </label>
                <Input
                  type='number'
                  step='0.1'
                  value={config.desviacionInforme}
                  onChange={handleInputChange('desviacionInforme')}
                  className='font-mono'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center pt-4'>
          <Button
            onClick={handleSimular}
            disabled={simulando}
            className='px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transform transition hover:scale-105'
          >
            {simulando ? 'Simulando...' : 'Ejecutar Simulación'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
