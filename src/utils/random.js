import { clampedFloat } from './clamp'

// given an array, return a random item from that array
export const chooseRandom = choices => {
  const keys = Object.keys(choices)
  const randex = Math.floor(Math.random() * keys.length)
  return choices[keys[randex]]
}

// insert min/max, get random in between - thanks, MDN
export const arbitraryRandom = (min, max) => {
  return min + (max - min) * Math.random()
}

// produces a random value appropriate to the intensity level
export const intensityScaledRandom = (low, high, intensity) => {
  const factor = clampedFloat(intensity, 0, 1)

  const [lowMin, lowMax] = low
  const [highMin, highMax] = high

  return arbitraryRandom(
    lowMin + (highMin - lowMin) * factor,
    lowMax + (highMax - lowMax) * factor
  )
}
