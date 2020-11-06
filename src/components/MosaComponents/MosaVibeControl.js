import React from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  vibeControls: {
    minWidth: 300,
    paddingTop: 16,
  },
  vibeSlider: {
    marginLeft: 24,
    marginRight: 24,
  },
})

export const MosaVibeControl = props => {
  const classes = useStyles()
  const { connected, target, commandRobot } = props

  const handleVibeChange = (channel, newValue) => {
    const newVibeValue = {}
    newVibeValue[channel] = newValue
    commandRobot(newVibeValue, 0)
  }

  const stopAllVibes = () => {
    commandRobot({ V0: 0, V1: 0, V2: 0 }, 0)
  }

  return (
    <Card className={classes.vibeControls}>
      <CardContent>
        <VibeSlider
          vibe="V0"
          value={target.V0}
          handleChange={handleVibeChange}
          connected={connected}
        />
        <VibeSlider
          vibe="V1"
          value={target.V1}
          handleChange={handleVibeChange}
          connected={connected}
        />
        <VibeSlider
          vibe="V2"
          value={target.V2}
          handleChange={handleVibeChange}
          connected={connected}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={stopAllVibes}
          variant="contained"
          color="secondary"
          disabled={!connected || target.V0 + target.V1 + target.V2 === 0} // disabled if we're not connected OR if all vibes are at zero
        >
          STOP VIBES
        </Button>
      </CardActions>
    </Card>
  )
}

const VibeSlider = props => {
  const { vibe, value, handleChange, connected } = props
  const classes = useStyles()
  return (
    <CardContent>
      <div className={classes.vibeSlider}>
        <Slider
          marks={[
            { value: 0, label: vibe + ' OFF' },
            { value: 999, label: ' MAX' },
          ]}
          step={1}
          min={0}
          max={999}
          value={value}
          onChange={(event, val) => handleChange(vibe, val)}
          valueLabelDisplay={connected ? 'on' : 'off'}
          disabled={!connected}
        />
      </div>
    </CardContent>
  )
}

export default MosaVibeControl
