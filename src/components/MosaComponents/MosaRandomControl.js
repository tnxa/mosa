import React, { useState } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
  Typography,
} from '@material-ui/core'

import { useInterval } from '../../hooks/useIntervalHook'
import { arbitraryRandom, chooseRandom } from '../../utils/random'

import { clampedNum } from '../../utils/clamp'

import { patterns } from '../../config/strokes'

const getStroke = (stroke, L0) => {
  const strokeLength = arbitraryRandom(stroke.min, stroke.max)
  return clampedNum(
    L0 < stroke.center ? L0 + strokeLength : L0 - strokeLength,
    0,
    999
  )
}

const getAngle = (angle, current) => {
  const newAngle = arbitraryRandom(0, angle)
  return clampedNum(
    Math.random() > 0.3 ? 500 + newAngle : 500 - newAngle,
    0,
    999
  )
}

const chooseNextDestination = (pattern, position) => {
  return {
    L0: getStroke(pattern.stroke, position.L0),
    R1: getAngle(pattern.angles.roll, position.R1), // arbitraryRandom(0, 999),
    R2: getAngle(pattern.angles.pitch, position.R2), // arbitraryRandom(0, 999),
  }
}

// currently only supports OSR2+ axes // TODO: support more
const calculateProfile = (position, destination, timer) => {
  return {
    dL0: (destination.L0 - position.L0) / timer,
    dR1: (destination.R1 - position.R1) / timer,
    dR2: (destination.R2 - position.R2) / timer,
  }
}

// currently only supports OSR2+ axes // TODO: support more
const calculateNextPosition = (position, profile, step) => {
  return {
    L0: position.L0 + profile.dL0 * step,
    R1: position.R1 + profile.dR1 * step,
    R2: position.R2 + profile.dR2 * step,
  }
}

export const MosaRandomControl = props => {
  const { connected, target, commandRobot } = props

  const [running, setRunning] = useState(false)

  const [timer, setTimer] = useState(500)
  const [step, setStep] = useState(50)
  const [patternTimer, setPatternTimer] = useState([0.5, 3.0])
  const [randomness, setRandomness] = useState(30)
  const [currentPattern, setCurrentPattern] = useState(chooseRandom(patterns))

  const [profile, setProfile] = useState({
    dL0: 0,
    dL1: 0,
    dL2: 0,
    dR0: 0,
    dR1: 0,
    dR2: 0,
  })

  // TODO: calculate sine targets in a more sophisticated way
  useInterval(() => {
    if (running && connected) {
      if (timer <= 0) {
        // do we change pattern?
        const pattern =
          Math.random() < randomness / 100
            ? chooseRandom(patterns)
            : currentPattern

        const newTimer =
          timer +
          arbitraryRandom(patternTimer[0] * 1000, patternTimer[1] * 1000)
        const nextDestination = chooseNextDestination(pattern, target) // choose the next destination
        const profile = calculateProfile(target, nextDestination, newTimer)

        setCurrentPattern(pattern)
        setProfile(profile)
        setTimer(newTimer) // add time to the timer
      } else {
        const nextPosition = calculateNextPosition(target, profile, step)
        commandRobot(nextPosition, step / 1000)
        setTimer(timer - step)
      }
    } // if not running & connected, no-op
  }, step) // next execution time will be `step` away

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Random: {currentPattern.name}</Typography>
        <hr />
        <Typography>Pattern Change: {randomness}%</Typography>
        <Slider
          value={randomness}
          min={0}
          max={100}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setRandomness(value)}
        />
        <Typography>
          Stroke Time ({patternTimer[0]} - {patternTimer[1]} seconds)
        </Typography>
        <Slider
          value={patternTimer}
          min={0.5}
          max={10}
          valueLabelDisplay={'auto'}
          onChange={(e, values) => setPatternTimer(values)}
        />
        <Typography>Update Frequency</Typography>
        <Slider
          value={step}
          min={10}
          max={100}
          step={1}
          track={false}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setStep(value)}
          marks={[{ value: 50, label: '50ms/step' }]}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={() => setRunning(!running)}
          variant="contained"
          color="default"
          disabled={!connected}
        >
          {running ? 'STOP' : 'START'}
        </Button>
        <Typography>
          Stroke Timer: {(timer >= 0 ? timer / 1000 : 0).toFixed(1)}s
        </Typography>
      </CardActions>
    </Card>
  )
}

export default MosaRandomControl
