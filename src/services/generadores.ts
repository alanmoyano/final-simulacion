export function exponencial(media: number): [number, number] {
  const rnd = Math.random()
  return [rnd, -media * Math.log(1 - rnd)]
}

export function uniforme(min: number, max: number): [number, number] {
  const rnd = Math.random()
  return [rnd, min + rnd * (max - min)]
}

export function normal(
  media: number,
  desviacion: number,
): [number, number, number, number] {
  const rnd1 = Math.random()
  const rnd2 = Math.random()

  return [
    rnd1,
    rnd2,

    media +
      desviacion *
        Math.sqrt(-2 * Math.log(rnd1)) *
        Math.cos(2 * Math.PI * rnd2),

    media +
      desviacion *
        Math.sqrt(-2 * Math.log(rnd1)) *
        Math.sin(2 * Math.PI * rnd2),
  ]
}
