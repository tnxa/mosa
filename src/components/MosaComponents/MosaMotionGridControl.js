import React, { useState } from 'react'

import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Height from '@material-ui/icons/Height'
import SyncAlt from '@material-ui/icons/SyncAlt'

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
})

export const MosaMotionGridControl = props => {
  const { connected, commandRobot } = props
  const { graphCard, graphGrid } = useStyles()

  const [running, setRunning] = useState(false)
  const [pitch, setPitch] = useState(500)

  const toggleRunning = () => {
    if (connected) setRunning(!running)
  }
  /**
   * Takes the onMouseMove event, extracts where the cursor is relative to that element in X and Y.
   * Returns an object containing L0/R1
   * @param {*} event the onMouseMove event
   */
  const getCommand = event => {
    // TODO: clean up the math here
    const boundingBox = event.target.getBoundingClientRect()
    const bbxHeight = boundingBox.bottom - boundingBox.top
    const bbxWidth = boundingBox.right - boundingBox.left

    const L0 = (1 - (event.clientY - boundingBox.top) / bbxHeight) * 1000
    const R1 = (1 - (event.clientX - boundingBox.left) / bbxWidth) * 1000
    const R2 = clampedNum(pitch, 0, 999) // to prevent scrolling out of bounds

    return { L0: L0, R1: R1, R2: R2 }
  }

  const handleMouseMove = mouseMoveEvent => {
    const { L0, R1, R2 } = getCommand(mouseMoveEvent)
    moveToTarget(L0, R1, R2)
  }

  const handleWheelMove = wheelMoveEvent => {
    const newDepth = clampedNum(pitch - wheelMoveEvent.deltaY / 2, 0, 999) // TODO: configure this magic number
    setPitch(newDepth)
    const { L0, R1, R2 } = getCommand(wheelMoveEvent)
    moveToTarget(L0, R1, R2)
  }

  /**
   * Takes target/destination values for L0 and R1, and writes that command to stream
   *
   * @param {number} L0Target 0-999 -- destination for L0
   * @param {number} R1Target 0-999 -- destination for R1
   * @param {number} R2Target 0-999 -- destination for R2
   */
  const moveToTarget = (L0Target, R1Target, R2Target) => {
    if (running) {
      commandRobot(
        {
          L0: L0Target,
          R1: R1Target,
          R2: R2Target,
        },
        0.05 // a small amount of smoothing // TODO: Paramaterize this?
      )
    }
  }

  return (
    <Card className={graphCard}>
      <CardContent>
        <Typography variant="h4">
          <Height />
          L0 x R1
          <SyncAlt />
        </Typography>

        <p>scroll to adjust R2</p>
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
            <i>hint: click on the grid to {running ? 'disable' : 'enable '}</i>
          )}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MosaMotionGridControl
