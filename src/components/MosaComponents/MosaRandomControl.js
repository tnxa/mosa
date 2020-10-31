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
import { chooseRandom } from '../../utils/random'

import { strokes } from '../../config/strokes'

export const MosaRandomControl = props => {
  const { connected, target, commandRobot } = props

  const [running, setRunning] = useState(false)

  const [timer, setTimer] = useState(0) // start with no seconds on the clock
  const [step, setStep] = useState(50)
  const [randomness, setRandomness] = useState(30)
  const [strokeType, setStrokeType] = useState(chooseRandom(strokes))
  const [stroke, setStroke] = useState(strokeType.getStroke(target, step))
  const [strokeCounter, setStrokeCounter] = useState(0)

  useInterval(() => {
    if (running && connected) {
      if (timer <= 0) {
        // do we change stroke?
        const newStrokeType =
          Math.random() * 100 < randomness ? chooseRandom(strokes) : strokeType

        const stroke = newStrokeType.getStroke(target, step)
        const newTimer = step * stroke.length // derive next timing from length of stroke

        setStrokeType(newStrokeType)
        setStroke(stroke)
        setTimer(newTimer) // add time to the timer
        setStrokeCounter(strokeCounter + 1)
      } else {
        // execute the next stroke step
        const destination = stroke[0]
        commandRobot(destination, step / 1000)
        setStroke(stroke.slice(1))
        setTimer(timer - step) // subtract time from the timer
      }
    } // if not running & connected, no-op
  }, step) // next execution time will be `step` away

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Random: {strokeType.name}</Typography>
        <hr />
        <Typography>Change Stroke: {randomness}%</Typography>
        <Slider
          value={randomness}
          min={0}
          max={100}
          valueLabelDisplay={'auto'}
          onChange={(e, value) => setRandomness(value)}
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
          disabled={running}
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
          Next: {(timer >= 0 ? timer / 1000 : 0).toFixed(1)}s
        </Typography>
        <Typography>-- Stroke #{strokeCounter}</Typography>
      </CardActions>
    </Card>
  )
}

export default MosaRandomControl
