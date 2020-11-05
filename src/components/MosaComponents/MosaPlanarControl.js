import React, { useState } from 'react'

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { clampedNum } from '../../utils/clamp'

const useStyles = makeStyles({
  graphCard: {
    textAlign: 'center',
  },
  graphGrid: {
    width: 301,
    height: 301,
    margin: 'auto',
    backgroundColor: '#eee',
    backgroundSize: '20px 20px',
    backgroundImage:
      'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px);',
    border: 0,
  },
  gridInput: {
    formControl: {
      margin: 16,
      minWidth: 120,
    },
  },
})

export const MosaPlanarControl = props => {
  const { connected, commandRobot } = props
  const { graphCard, graphGrid, gridInput } = useStyles()

  const [running, setRunning] = useState(false)
  const [pitch, setPitch] = useState(500)
  const [yAxis, setYAxis] = useState('L0')
  const [xAxis, setXAxis] = useState('R1')
  const [zAxis, setZAxis] = useState('R2')

  const [xAxisFlipped, setXAxisFlipped] = useState(true)

  const toggleRunning = () => {
    if (connected) setRunning(!running)
  }
  /**
   * Takes the onMouseMove event, extracts where the cursor is relative to that element in X and Y.
   * Returns an object containing L0/R1
   * @param {*} event the onMouseMove event
   * @returns an object containing the X/Y/Z axes
   */
  const getCommand = event => {
    // TODO: clean up the math here
    const boundingBox = event.target.getBoundingClientRect()
    const bbxHeight = boundingBox.bottom - boundingBox.top
    const bbxWidth = boundingBox.right - boundingBox.left

    const Y = (1 - (event.clientY - boundingBox.top) / bbxHeight) * 1000
    const X = xAxisFlipped
      ? (1 - (event.clientX - boundingBox.left) / bbxHeight) * 1000
      : (1 - (boundingBox.right - event.clientX) / bbxWidth) * 1000
    const Z = clampedNum(pitch, 0, 999) // to prevent scrolling out of bounds

    return { Y: Y, X: X, Z: Z }
  }

  const handleMouseMove = mouseMoveEvent => {
    const { X, Y, Z } = getCommand(mouseMoveEvent)
    moveToTarget(X, Y, Z)
  }

  const handleWheelMove = wheelMoveEvent => {
    const newDepth = clampedNum(pitch - wheelMoveEvent.deltaY / 2, 0, 999) // TODO: configure this magic number
    setPitch(newDepth)
    const { X, Y, Z } = getCommand(wheelMoveEvent)
    moveToTarget(X, Y, Z)
  }

  /**
   * Takes target/destination values from x/y/z axes and writes that command to stream
   *
   * @param {number} XTarget 0-999
   * @param {number} YTarget 0-999
   * @param {number} ZTarget 0-999
   */
  const moveToTarget = (XTarget, YTarget, ZTarget) => {
    if (running) {
      let target = {}
      target[xAxis] = XTarget
      target[yAxis] = YTarget
      target[zAxis] = ZTarget
      commandRobot(target, 0.05) // a small amount of smoothing // TODO: Paramaterize this?
    }
  }

  const SelectAxis = ({ axis, setAxis }) => {
    return (
      <Select value={axis} onChange={e => setAxis(e.target.value)}>
        <MenuItem value={'L0'}>L0</MenuItem>
        <MenuItem value={'L1'}>L1</MenuItem>
        <MenuItem value={'L2'}>L2</MenuItem>
        <MenuItem value={'R0'}>R0</MenuItem>
        <MenuItem value={'R1'}>R1</MenuItem>
        <MenuItem value={'R2'}>R2</MenuItem>
      </Select>
    )
  }

  return (
    <Card className={graphCard}>
      <CardContent>
        <Typography>
          <FormControl className={gridInput}>
            <SelectAxis axis={yAxis} setAxis={setYAxis} />
            <FormHelperText>Vertical Move</FormHelperText>
          </FormControl>{' '}
          <FormControl className={gridInput}>
            <SelectAxis axis={xAxis} setAxis={setXAxis} />
            <FormHelperText>Horizontal Move</FormHelperText>
          </FormControl>{' '}
          <FormControl className={gridInput}>
            <SelectAxis axis={zAxis} setAxis={setZAxis} />
            <FormHelperText>Scroll Wheel</FormHelperText>
          </FormControl>
        </Typography>
        <button
          className={graphGrid}
          onMouseMove={handleMouseMove}
          onClick={toggleRunning} // causes jsx-a11y warnings // TODO: address accessibility
          onWheel={handleWheelMove}
        >
          +
        </button>
        <br />
        <br />
        <Typography>
          {!connected ? (
            <i>connect to your MAxSR to start interacting</i>
          ) : (
            <>
              <i>
                hint: click on the grid to {running ? 'disable' : 'enable '}
              </i>
            </>
          )}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => setXAxisFlipped(!xAxisFlipped)}
          variant={'outlined'}
        >
          Flip X Axis ({xAxisFlipped ? '++' : '--'})
        </Button>
      </CardActions>
    </Card>
  )
}

export default MosaPlanarControl
