type BaseHeader = {
  name: string
  description: string // Used ƒor better understanding of the value
  repeat?: boolean // If true, this header will be repeated for each number of the corresponding variable
}

type Header =
  | BaseHeader
  | (BaseHeader & {
      children: Header[] // In this case, the header is used as a 'title' for the children, which all are 'sub-headers'
    })

export const headers: Header[] = [
  {
    name: 'Control',
    description:
      'Header padre de control para los datos que identifican a cada fila',
    children: [
      {
        name: 'Reloj',
        description: 'Reloj actual de la simulación',
      },
      {
        name: 'Evento',
        description: 'Evento actual de la simulación',
      },
    ],
  },
  {
    name: 'Llegada',
    description:
      'Header padre de los datos necesarios para calcular la llegada de clientes',
    children: [
      {
        name: 'rnd',
        description: 'Número aleatorio generado para la llegada de clientes',
      },
      {
        name: 'Tiempo',
        description:
          'El tiempo de llegada del cliente, calculado con la distribución exponencial',
      },
      {
        name: 'Proxima llegada',
        description:
          'El tiempo en el que llegará el siguiente cliente, calculado como la suma del tiempo de llegada y el reloj actual',
      },
    ],
  },
  {
    name: 'Atención cajas',
    description:
      'Header padre de todos los datos sobre la atención de las cajas',
    children: [
      {
        name: 'rnd',
        description: 'Número aleatorio generado para la atención de las cajas',
      },
      {
        name: 'Tiempo',
        description:
          'El tiempo de atención del cliente, calculado con la distribución uniforme',
      },
      {
        name: 'Fin atención $numeroCaja', // The param `cantidadCajas` describes the amount of $numeroCaja that will be repeated
        description:
          'El tiempo en el que termina la atención del cliente en la caja $numeroCaja, calculado como la suma del tiempo de atención y el reloj actual si corresponde a dicha caja',
        repeat: true,
      },
    ],
  },
  {
    name: 'Atención actualización',
    description:
      'Header padre de todos los datos sobre la atención de la actualización de los datos',
    children: [
      {
        name: 'rnd',
        description:
          'Número aleatorio generado para la atención de la actualización de los datos',
      },
      {
        name: 'Tiempo',
        description:
          'El tiempo de atención de la actualización de los datos, calculado con la distribución exponencial',
      },
      {
        name: 'Fin atención $numeroEmpleado', // The param `cantidadEmpleados` describes the amount of $numeroEmpleado that will be repeated
        description:
          'El tiempo en el que termina la atención del empleado $numeroEmpleado, calculado como la suma del tiempo de atención y el reloj actual si corresponde a dicho empleado',
        repeat: true,
      },
    ],
  },
  {
    name: 'Atención informes',
    description:
      'Header padre de todos los datos sobre la atención de la empleada',
    children: [
      {
        name: 'rnd1',
        description:
          'Primer número aleatorio generado para la atención de la empleada',
      },
      {
        name: 'rnd2',
        description:
          'Segundo número aleatorio generado para la atención de la empleada',
      },
      {
        name: 'Tiempo',
        description:
          'El tiempo de atención de la empleada, calculado con la distribución normal',
      },
      {
        name: 'Fin atención (n1) e:$numeroEmpleada', // The param `cantidadEmpleadas` describes the amount of $numeroEmpleada that will be repeated. The number in the name is the first result of the distribution
        description:
          'El tiempo en el que termina la atención de la empleada $numeroEmpleada, calculado como la suma del tiempo de atención y el reloj actual si corresponde a dicha empleada',
        repeat: true,
      },
      {
        name: 'Fin atención (n2) $numeroEmpleada', // The param `cantidadEmpleadas` describes the amount of $numeroEmpleada that will be repeated. The number in the name is the second result of the distribution
        description:
          'El tiempo en el que termina la atención de la empleada $numeroEmpleada, calculado como la suma del tiempo de atención y el reloj actual si corresponde a dicha empleada',
        repeat: true,
      },
    ],
  },
  {
    name: 'Primer destino',
    description:
      'Header padre de todos los datos sobre el primer destino de los clientes',
    children: [
      {
        name: 'rnd',
        description: 'Número aleatorio generado para el primer destino',
      },
      {
        name: 'destino',
        description:
          'El destino del cliente, que puede ser pago o actualización', // The param `proporcionFacturasVencidas` describes the probability of the client going to the payment destination
      },
    ],
  },
  {
    name: 'Segundo destino',
    description:
      'Header padre de todos los datos sobre el segundo destino de los clientes',
    children: [
      {
        name: 'rnd',
        description: 'Número aleatorio generado para el segundo destino',
      },
      {
        name: 'destino',
        description:
          'El destino del cliente, que puede ser actualización o informes', // The param `proporcionActualizacion` describes the probability of the client going to the payment destination
      },
    ],
  },
  {
    name: 'Colas',
    description:
      'Header padre de todos los datos sobre las colas de los clientes',
    children: [
      {
        name: 'Cola cajas',
        description: 'La cantidad de clientes en la cola de las cajas',
      },
      {
        name: 'Cola actualización',
        description: 'La cantidad de clientes en la cola de la actualización',
      },
      {
        name: 'Cola informes',
        description: 'La cantidad de clientes en la cola de los informes',
      },
    ],
  },
  {
    name: 'Estadística',
    description:
      'Header padre de todos los datos sobre la estadística de la simulación',
    children: [
      {
        name: 'Acumulador tiempo de espera en cajas',
        description:
          'El tiempo total de espera de los clientes en las cajas, calculado como la sumatoria de los tiempos de espera de los clientes en las cajas',
      },
      {
        name: 'Acumulador tiempo de permanencia',
        description:
          'El tiempo total de permanencia de los clientes en el sistema, calculado como la suma de los tiempos de espera y atención de los clientes en todo su proceso',
      },
      {
        name: 'Total personas atendidas en caja',
        description:
          'El total de personas atendidas en las cajas, calculado como la sumatoria de las personas atendidas en las cajas, luego de irse',
      },
      {
        name: 'Promedio tiempo de espera en cajas',
        description:
          'El promedio de tiempo de espera de los clientes en las cajas, calculado como el acumulador tiempo de espera en cajas dividido por el total de personas atendidas en cajas',
      },
      {
        name: 'Promedio tiempo de permanencia',
        description:
          'El promedio de tiempo de permanencia de los clientes en el sistema, calculado a través de la sumatoria de los tiempos de permanencia de los clientes en el sistema, dividido por el total de personas atendidas en caja (dado que resumen el total de personas atendidas en el sistema)',
      },
    ],
  },
  {
    name: 'Servidores',
    description:
      'Header padre de todos los datos sobre los servidores de la simulación',
    children: [
      {
        name: 'Estado caja $numeroCaja',
        description:
          'El estado de la caja $numeroCaja, el cuál puede ser ocupado o libre',
        repeat: true,
      },
      {
        name: 'Estado empleado $numeroEmpleado',
        description:
          'El estado del empleado $numeroEmpleado, el cuál puede ser ocupado o libre',
        repeat: true,
      },
      {
        name: 'Estado empleada $numeroEmpleada',
        description:
          'El estado de la empleada $numeroEmpleada, el cuál puede ser ocupado o libre',
        repeat: true,
      },
    ],
  },
]
