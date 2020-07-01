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

// TODO: refactor, potentially into useEffect + useInterval
let timer = 1000 * Math.PI // for clean transitions we need this to be a multiple of Pi

export const MosaSineControl = props => {
  const { connected, commandRobot } = props

  const [running, setRunning] = useState(false)
  const [settings, changeSettings] = useState({
    L0Speed: 1, // TODO: add more settings
  })

  const step = 50

  const startSines = () => {
    setRunning(true)
  }

  const stopSines = () => {
    setRunning(false)
  }

  const handleL0SliderChange = (event, newValue) => {
    changeSettings({ ...settings, L0Speed: newValue })
  }

  // TODO: calculate sine targets in a more sophisticated way
  useInterval(() => {
    if (running && connected) {
      if (timer <= 0) timer += 1000 * Math.PI // for clean transitions we need this to be a multiple of Pi
      const newPosition = {
        L0: Math.floor((1000 * (1 + Math.sin(settings.L0Speed * timer))) / 2), // constrained to fractions by control
        R1: Math.floor((1000 * (1 + Math.sin(timer))) / 2),
        R2: Math.floor((1000 * (1 + Math.cos(timer))) / 2),
      }

      commandRobot(newPosition, step / 1000)
      timer -= step
    }
  }, step)

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Sines</Typography>
        <Typography>Slider controls L0 Intensity</Typography>
        <SineSlider changeSettings={handleL0SliderChange} disabled={running} />
      </CardContent>
      <CardActions>
        <Button
          onClick={startSines}
          variant="contained"
          color="default"
          disabled={!connected || running}
        >
          START SINES
        </Button>
        <Button
          onClick={stopSines}
          variant="contained"
          color="secondary"
          disabled={!connected || !running}
        >
          STOP SINES
        </Button>
      </CardActions>
    </Card>
  )
}

const SineSlider = props => {
  const { changeSettings, disabled } = props
  return (
    <CardContent>
      <Slider
        onChange={changeSettings}
        step={0.25}
        min={0.25}
        max={4}
        defaultValue={1}
        valueLabelDisplay="auto"
        disabled={disabled}
      ></Slider>
    </CardContent>
  )
}

export default MosaSineControl
