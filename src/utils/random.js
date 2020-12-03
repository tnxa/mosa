import { clampedFloat } from './clamp'

// given an object, return a random value from that object -- TODO: refactor this
export const chooseRandomStroke = choices => {
  const enabledChoicesArray = Object.entries(choices).filter(
    stroke => stroke[1].enabled
  )
  const enabledChoices = {}
  for (const index in enabledChoicesArray) {
    enabledChoices[enabledChoicesArray[index][0]] =
      enabledChoicesArray[index][1]
  }
  const keys = Object.keys(enabledChoices)
  const randex = Math.floor(Math.random() * keys.length)
  return enabledChoices[keys[randex]]
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
