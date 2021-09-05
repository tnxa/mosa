import { clampedNum } from './clamp'

// constructs tcode strings for channel/value combos (0 <= value <= 0.999)
export const tCode = (channel, value) => {
  if (value < 0) value = 0
  if (value > 999) value = 999
  const scaledValue = Math.floor(value)
  const paddedValue = String(scaledValue).padStart(3, '0')
  return channel + paddedValue
}

// assumes interval in seconds, convert to tcode string
export const intervalTCode = interval => {
  // convert interval to 1-9999 ms
  const millisecondInterval = clampedNum(Math.floor(interval * 1000), 1, 9999)
  const paddedInterval = String(millisecondInterval).padStart(4, '0')
  return 'I' + String(paddedInterval)
}

// return tcode for all supplied axes in destination, with interval if supplied
export const constructTCodeCommand = (destination, interval) => {
  // create tcode for each axis we have
  const commands = Object.keys(destination).map(
    axis =>
      tCode(axis, destination[axis]) + (interval ? intervalTCode(interval) : '')
  )

  return commands.join(' ')
}

// given axial movement and output range, scales outputs to the range
export const scaleAxes = (axes, outputRange) => {
  const {
    L0Min,
    L0Max,
    L1Min,
    L1Max,
    L2Min,
    L2Max,
    R0Min,
    R0Max,
    R1Min,
    R1Max,
    R2Min,
    R2Max,
    V0Min,
    V0Max,
    V1Min,
    V1Max,
    V2Min,
    V2Max,
    A0Min,
    A0Max,
  } = outputRange
  return {
    ...(axes.L0 !== undefined && {
      L0: L0Min + (axes.L0 / 1000) * (L0Max - L0Min),
    }),
    ...(axes.L1 !== undefined && {
      L1: L1Min + (axes.L1 / 1000) * (L1Max - L1Min),
    }),
    ...(axes.L2 !== undefined && {
      L2: L2Min + (axes.L2 / 1000) * (L2Max - L2Min),
    }),
    ...(axes.R0 !== undefined && {
      R0: R0Min + (axes.R0 / 1000) * (R0Max - R0Min),
    }),
    ...(axes.R1 !== undefined && {
      R1: R1Min + (axes.R1 / 1000) * (R1Max - R1Min),
    }),
    ...(axes.R2 !== undefined && {
      R2: R2Min + (axes.R2 / 1000) * (R2Max - R2Min),
    }),
    ...(axes.V0 !== undefined && {
      V0: V0Min + (axes.V0 / 1000) * (V0Max - V0Min),
    }),
    ...(axes.V1 !== undefined && {
      V1: V1Min + (axes.V1 / 1000) * (V1Max - V1Min),
    }),
    ...(axes.V2 !== undefined && {
      V2: V2Min + (axes.V2 / 1000) * (V2Max - V2Min),
    }),
    ...(axes.A0 !== undefined && {
      A0: A0Min + (axes.A0 / 1000) * (A0Max - A0Min),
    }),
  }
}
