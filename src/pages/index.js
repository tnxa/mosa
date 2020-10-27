import React, { useState } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { Card, Typography, CardContent, Grid, Divider } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import { defaultTarget, defaultRange } from '../config/defaults'

import { useSerial } from '../hooks/useSerialHook'
import { scaleAxes, constructTCodeCommand } from '../utils/tcode'

import MosaOutputRangeControl from '../components/MosaComponents/MosaOutputRangeControl'
import MosaMotionControl from '../components/MosaComponents/MosaMotionControl'
import MosaMotionGridControl from '../components/MosaComponents/MosaMotionGridControl'
import MosaVibeControl from '../components/MosaComponents/MosaVibeControl'
import MosaSineControl from '../components/MosaComponents/MosaSineControl'

const IndexPage = () => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [connectToSerial, disconnectFromSerial, writeToSerial] = useSerial()
  const [connected, setConnected] = useState(false)

  const [target, setTarget] = useState(defaultTarget)
  const [outputRange, setOutputRange] = useState(defaultRange)

  const [inputMethod, setSelectedInputMethod] = useState('web')
  const [outputMethod, setSelectedOutputMethod] = useState()

  const handleInputMethodChange = (event, newInputMethod) => {
    setSelectedInputMethod(newInputMethod)
  }

  // todo: make this better
  const handleOutputMethodChange = (event, newOutputMethod) => {
    switch (newOutputMethod) {
      case null: // none selected or active is deselected
        disconnectFromSerial() // and eventually all other input methods
        break
      case 'serial':
        isSerialAvailable && connected
          ? handleDisconnectFromSerial()
          : handleConnectToSerial()
        break
      default:
        console.warn(
          '[OSR][WARN] Unknown input method selected: ' + newOutputMethod
        )
    }
    setSelectedOutputMethod(newOutputMethod)
  }

  const handleConnectToSerial = async () => {
    try {
      await connectToSerial()
      setConnected(true)
    } catch (e) {
      console.error(e)
      setConnected(false)
      setSelectedOutputMethod(null) // connecting failed :(
      // TODO: set error state, create/catch via error boundary?
    }
  }
  const handleDisconnectFromSerial = async () => {
    commandRobot(defaultTarget, 1)
    await disconnectFromSerial()
    setConnected(false)
  }

  const commandRobot = (destination, interval) => {
    // persist target to state
    const newTarget = { ...target, ...destination }
    setTarget(newTarget)

    // tell the robot what to do
    const scaledDestination = scaleAxes(newTarget, outputRange)
    writeToSerial(constructTCodeCommand(scaledDestination, interval))
  }

  return (
    <Layout>
      <SEO title="Controls" />
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} md={4} lg={3}>
          <Card>
            <CardContent>
              <Typography>Input: {!inputMethod && 'none selected'} </Typography>
              <ToggleButtonGroup
                value={inputMethod}
                exclusive
                onChange={handleInputMethodChange}
              >
                <ToggleButton value="web">WEB</ToggleButton>
                <ToggleButton value="remote" disabled>
                  REMOTE
                </ToggleButton>
              </ToggleButtonGroup>
              <br />
              <br />
              <Typography>
                Output: {!outputMethod && 'none selected'}
              </Typography>
              <ToggleButtonGroup
                value={outputMethod}
                exclusive
                onChange={handleOutputMethodChange}
              >
                <ToggleButton
                  value="serial"
                  disabled={!isSerialAvailable}
                  selected={
                    isSerialAvailable && connected && outputMethod === 'serial'
                  }
                >
                  SERIAL
                </ToggleButton>
                <ToggleButton value="visualizer" disabled>
                  SR-VIS
                </ToggleButton>
              </ToggleButtonGroup>
              <br />
              <br />
              <Typography variant="caption"> (more I/O coming soon)</Typography>
              {!isSerialAvailable && ( // if serial not available, explain
                <>
                  <br />
                  <Typography>
                    Could not detect serial capabilities. Please use the latest
                    version of Chrome, open <code>chrome://flags</code>, and set
                    <code>#enable-experimental-web-platform-features</code>{' '}
                    (note that these are experimental features, use at your own
                    risk, etc etc)
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
          <hr />
          <MosaOutputRangeControl
            outputRange={outputRange}
            setOutputRange={setOutputRange}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={5}>
          <MosaMotionControl
            connected={connected}
            target={target}
            commandRobot={commandRobot}
          />
          <hr />
          <MosaVibeControl
            connected={connected}
            target={target}
            commandRobot={commandRobot}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <MosaMotionGridControl
            connected={connected}
            commandRobot={commandRobot}
          />
          <hr />
          <MosaSineControl
            connected={connected}
            target={target}
            commandRobot={commandRobot}
          />
        </Grid>
      </Grid>
      &nbsp;
      <Divider />
    </Layout>
  )
}

export default IndexPage
