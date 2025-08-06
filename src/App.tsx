import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { simulacion } from './services/simulacion'

function App() {
  const [filas, setFilas] = useState<unknown[]>([])
  const [cantidadFilas, setCantidadFilas] = useState(0)

  function handleSimular() {
    const startTime = new Date()

    const [cantidadFilas, filas] = simulacion()

    const endTime = new Date()
    const executionTime = endTime.getTime() - startTime.getTime()
    console.log(`Execution time: ${executionTime} milliseconds`)

    setFilas(filas)
    setCantidadFilas(cantidadFilas)
  }

  return (
    <div>
      <h1>Simulación</h1>
      <Button onClick={handleSimular} className='cursor-pointer'>
        Simular
      </Button>
      <p>
        Cantidad de filas: <span className='font-mono'>{cantidadFilas}</span>
      </p>
      {cantidadFilas > 0 && (
        <div>
          <div>
            <h2>Fila 1</h2>
            <pre>{JSON.stringify(filas.at(0), null, 2)}</pre>
          </div>
          {/* {filas.map((fila, index) => (
        <div key={index}>
        <h2>Fila {index + 1}</h2>
        <pre>{JSON.stringify(fila, null, 2)}</pre>
        </div>
        ))} */}
          <div>
            <h2>Fila {cantidadFilas}</h2>
            <pre>{JSON.stringify(filas.at(-1), null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
