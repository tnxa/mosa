import React from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Slider,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong'

const useStyles = makeStyles({
  linears: {
    minWidth: 300,
    display: 'flex',
    justifyContent: 'space-around',
  },
  rotators: {
    marginRight: 24,
    marginLeft: 24,
  },
  slider: {
    height: 300,
  },
})

export const MosaMotionControl = props => {
  const classes = useStyles()
  const { connected, target, commandRobot } = props

  const handleAxisChange = (axis, newValue) => {
    const command = {}
    command[axis] = newValue
    commandRobot(command, 0)
  }

  const homeAxes = () => {
    commandRobot({ L0: 500, L1: 500, L2: 500, R0: 500, R1: 500, R2: 500 }, 1)
  }

  return (
    <Card>
      <CardContent className={classes.linears}>
        <VerticalSlider
          axis="L0"
          value={target.L0}
          handleValueChange={(event, newValue) => {
            handleAxisChange('L0', newValue)
          }}
          connected={connected}
        />

        <VerticalSlider
          axis="R2"
          value={target.R2}
          handleValueChange={(event, newValue) => {
            handleAxisChange('R2', newValue)
          }}
          connected={connected}
        />

        <VerticalSlider
          axis="L1"
          value={target.L1}
          handleValueChange={(event, newValue) => {
            handleAxisChange('L1', newValue)
          }}
          connected={connected}
        />
      </CardContent>

      <CardContent className={classes.rotators}>
        <HorizontalSlider
          marks={[
            { value: 0, label: 'L2 LEFT' },
            { value: 999, label: 'L2 RIGHT' },
          ]}
          connected={connected}
          value={target.L2}
          handleValueChange={(event, newValue) => {
            handleAxisChange('L2', newValue)
          }}
        />
      </CardContent>

      <CardContent className={classes.rotators}>
        <HorizontalSlider
          marks={[
            { value: 0, label: 'R1 LEFT' },
            { value: 999, label: 'R1 RIGHT' },
          ]}
          connected={connected}
          value={target.R1}
          handleValueChange={(event, newValue) => {
            handleAxisChange('R1', newValue)
          }}
        />
      </CardContent>
      <CardContent className={classes.rotators}>
        <HorizontalSlider
          marks={[
            { value: 0, label: 'R0 CCW' },
            { value: 999, label: 'R0 CW' },
          ]}
          connected={connected}
          value={target.R0}
          handleValueChange={(event, newValue) => {
            handleAxisChange('R0', newValue)
          }}
        />
      </CardContent>
      <CardActions>
        <Button
          onClick={homeAxes}
          disabled={!connected}
          startIcon={<CenterFocusStrongIcon />}
          variant="outlined"
        >
          Home MAxSR
        </Button>
      </CardActions>
    </Card>
  )
}

const HorizontalSlider = props => {
  const { marks, connected, value, handleValueChange } = props
  return (
    <Slider
      marks={marks}
      step={1}
      min={0}
      max={999}
      value={Math.round(value)}
      onChange={handleValueChange}
      valueLabelDisplay={connected ? 'on' : 'off'}
      disabled={!connected}
      track={false}
    />
  )
}

const VerticalSlider = props => {
  const { axis, value, handleValueChange, connected } = props
  const classes = useStyles()
  return (
    <div>
      <div>
        <Typography variant="h3">{axis}</Typography>
      </div>
      <div className={classes.slider}>
        <Slider
          marks={[
            { value: 0, label: axis + ' MIN' },
            { value: 999, label: axis + ' MAX' },
          ]}
          step={1}
          min={0}
          max={999}
          orientation="vertical"
          value={Math.round(value)}
          onChange={handleValueChange}
          valueLabelDisplay={connected ? 'on' : 'off'}
          disabled={!connected}
          track={false}
        />
      </div>
    </div>
  )
}

export default MosaMotionControl
