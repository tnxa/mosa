import { clampedNum } from '../utils/clamp'

// each element of `strokes` should have a `name` and a `getStroke(position, step)` function, at a minimum.
// the `getStroke` function should, given a current position and step time, return an array of commands
// commands returned should be in the format [ {}, {}, {}, ... ]
// individual commands should be in the format { L0: #, L1: #, L2: #, R0: #, R1: #, R2: # };
// where L0-L2, R0-R2 are the target position in tcode axes.

// todo: develop more stroke types and parameterize them // #helpwanted

export const strokes = {
  ShortStrokes: {
    name: 'Short Stroke',
    getStroke: (position, step) => {
      const strokeTime = 800 // .8 seconds
      const distanceFactor = 0.5

      const steps = strokeTime / step

      let stroke = [],
        pL0 = position.L0, // previous L0
        pR1 = position.R1, // previous L1
        pR2 = position.R2 // previous L2

      const direction = pL0 < 500 ? 1 : -1 // if in bottom half, we go up; if in top half, we go down
      const possibleStrokeLength = Math.max(pL0, 1000 - pL0) * distanceFactor // current to bottom, or current to top

      for (let i = 1; i <= steps; i++) {
        // choose next points
        const nL0 = clampedNum(
            pL0 + (direction * possibleStrokeLength) / steps,
            0,
            1000
          ),
          nR1 = (pR1 + 500) / 2, // eventually move to middle
          nR2 = (pR2 + 500) / 2 // eventually move to middle

        // append next to stroke points
        stroke.push({
          L0: nL0,
          R1: nR1,
          R2: nR2,
        })

        // for next iteration, new points become previous points
        pL0 = nL0
        pR1 = nR1
        pR2 = nR2
      }

      return stroke
    },
  },
  LongStrokes: {
    name: 'Long Stroke',
    getStroke: (position, step) => {
      const strokeTime = 800 // .8 seconds
      const distanceFactor = 0.9

      const steps = strokeTime / step

      let stroke = [],
        pL0 = position.L0, // previous L0
        pR1 = position.R1, // previous L1
        pR2 = position.R2 // previous L2

      const direction = pL0 < 500 ? 1 : -1 // if in bottom half, we go up; if in top half, we go down
      const possibleStrokeLength = Math.max(pL0, 1000 - pL0) * distanceFactor // current to bottom, or current to top

      for (let i = 1; i <= steps; i++) {
        // choose next points
        const nL0 = clampedNum(
            pL0 + (direction * possibleStrokeLength) / steps,
            0,
            1000
          ),
          nR1 = (pR1 + 500) / 2, // eventually move to middle
          nR2 = (pR2 + 500) / 2 // eventually move to middle

        // append next to stroke points
        stroke.push({
          L0: nL0,
          R1: nR1,
          R2: nR2,
        })

        // for next iteration, new points become previous points
        pL0 = nL0
        pR1 = nR1
        pR2 = nR2
      }

      return stroke
    },
  },
  LongJerky: {
    name: 'Long Jerk',
    getStroke: (position, step) => {
      // const strokeTime = 2000 // 2 seconds
      const maxPercentTravel = 0.75
      const jerk = 0.01 // todo: leverage some function of this to gently accel/decel

      // const steps = strokeTime / step

      const oL0 = position.L0,
        oR1 = position.R1,
        oR2 = position.R2

      let stroke = [],
        acceleration = 0,
        velocity = 0,
        pL0 = oL0, // previous L0 starts as original L0
        pR1 = oR1, // previous L1 starts as original L1
        pR2 = oR2 // previous L2 starts as original L2

      const direction = pL0 < 500 ? 1 : -1 // if in bottom half, we go up; if in top half, we go down
      const possibleStrokeLength = Math.max(pL0, 1000 - pL0) * maxPercentTravel // current to bottom, or current to top
      const fL0 = pL0 + direction * possibleStrokeLength // final L0

      // condition based on direction; loop until we pass destination
      while (direction > 0 ? pL0 < fL0 : pL0 > fL0) {
        acceleration += direction * jerk * step
        velocity += acceleration + (1 / 2) * direction * jerk * step

        const positional =
          velocity + (1 / 2) * acceleration + (1 / 6) * direction * jerk

        const nL0 = clampedNum((pL0 += positional), 0, 1000),
          nR1 = (pR1 + 500) / 2, // eventually move to middle
          nR2 = (pR2 + 500) / 2 // eventually move to middle

        stroke.push({
          L0: nL0,
          R1: nR1,
          R2: nR2,
        })

        // for next iteration, new points become previous points
        pL0 = nL0
        pR1 = nR1
        pR2 = nR2
      }
      return stroke
    },
  },
  Orbit: {
    name: 'Orbit',
    getStroke: (position, step) => {
      const strokeTime = 2000 // 2 seconds
      const steps = strokeTime / step
      const oL0 = position.L0,
        oR1 = position.R1,
        oR2 = position.R2

      let stroke = [],
        pL0 = oL0, // previous L0 starts as original L0
        pR1 = oR1, // previous L1 starts as original L1
        pR2 = oR2 // previous L2 starts as original L2

      for (let i = 1; i <= steps; i++) {
        // choose next points
        const nL0 = pL0 + 5 * Math.cos((i / steps) * Math.PI),
          nR1 = pR1 + 20 * Math.cos((i / steps) * 2 * Math.PI),
          nR2 = pR2 + 15 * Math.sin((i / steps) * 2 * Math.PI) // can we find a way to center this?

        // append next to stroke points
        stroke.push({
          L0: nL0,
          R1: nR1,
          R2: nR2,
        })
        // for next iteration, new points become previous points
        pL0 = nL0
        pR1 = nR1
        pR2 = nR2
      }
      return stroke
    },
  },
}
