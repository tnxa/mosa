import React, { useState } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { Card, Typography, CardContent, Grid, Divider } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'

import { defaultRange, defaultTarget } from '../config/defaults'

import { useSerial } from '../hooks/useSerialHook'
import { scaleAxes, constructTCodeCommand } from '../utils/tcode'

import { SettingsContext } from '../../gatsby-browser'

import MosaOutputRangeControl from '../components/MosaComponents/MosaOutputRangeControl'
import MosaMotionControl from '../components/MosaComponents/MosaMotionControl'
import MosaPlanarControl from '../components/MosaComponents/MosaPlanarControl'
import MosaVibeControl from '../components/MosaComponents/MosaVibeControl'
import MosaSineControl from '../components/MosaComponents/MosaSineControl'
import MosaVisualizer from '../components/MosaComponents/MosaVisualizer'
import MosaRandomControl from '../components/MosaComponents/MosaRandomControl'

const IndexPage = () => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [connectToSerial, disconnectFromSerial, writeToSerial] = useSerial()
  const [connected, setConnected] = useState(false)

  const [target, setTarget] = useState(defaultTarget)

  const [inputMethod, setSelectedInputMethod] = useState('web')
  const [outputMethod, setSelectedOutputMethod] = useState()

  const handleInputMethodChange = (event, newInputMethod) => {
    setSelectedInputMethod(newInputMethod)
  }

  // todo: make this better
  const handleOutputMethodChange = async (event, newOutputMethod) => {
    if (connected) {
      await handleDisconnectFromSerial() // eventually, all methods
      await handleDisconnectFromVisualization()
    }

    switch (newOutputMethod) {
      case null: // none selected or active is deselected
        console.log('[OSR][INFO] Disconnecting from outputs.')
        break
      case 'serial':
        handleConnectToSerial()
        break
      case 'visualizer':
        handleConnectToVisualization()
        break
      default:
        console.warn(
          '[OSR][WARN] Unknown output method selected: ' + newOutputMethod
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
    commandRobot(defaultTarget, 1, defaultRange)
    await disconnectFromSerial()
    setConnected(false)
  }

  const handleConnectToVisualization = async () => {
    console.log('[OSR][DEV] Connecting to SR Visualization')
    setConnected(true)
  }
  const handleDisconnectFromVisualization = async () => {
    console.log('[OSR][DEV] Disconnecting from SR Visualization')
    setConnected(false)
  }

  const commandRobot = (destination, interval, settings) => {
    // persist target to state
    const newTarget = { ...target, ...destination }
    setTarget(newTarget)

    // tell the robot what to do
    const scaledDestination = scaleAxes(newTarget, settings)
    const command = constructTCodeCommand(scaledDestination, interval)
    switch (outputMethod) {
      case 'serial':
        writeToSerial(command)
        break
      case 'visualizer':
        console.log('[OSR][DEV] Output to vis: ' + command)
        break
      default:
        console.warn('[OSR][DEV] unknown output method - command: ' + command)
    }
  }

  return (
    <SettingsContext.Consumer>
      {({ settings, updateSettings }) => (
        <Layout>
          <SEO title="Controls" />
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography>
                    Input: {!inputMethod && 'none selected'}
                  </Typography>
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
                    {isSerialAvailable && (
                      <ToggleButton value="serial">SERIAL</ToggleButton>
                    )}
                    <ToggleButton value="visualizer">SR-VIS</ToggleButton>
                  </ToggleButtonGroup>
                  <br />
                  <br />
                  <Typography variant="caption">
                    (more I/O coming soon)
                  </Typography>
                  {!isSerialAvailable && ( // if serial not available, explain
                    <>
                      <br />
                      <Typography>
                        Could not detect serial capabilities. Please use the
                        latest version of Chrome, open{' '}
                        <code>chrome://flags</code>, and set
                        <code>
                          #enable-experimental-web-platform-features
                        </code>{' '}
                        (note that these are experimental features, use at your
                        own risk, etc etc)
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
              <hr />
              <MosaVisualizer target={target} />
              <hr />
              <MosaOutputRangeControl
                settings={settings}
                updateSettings={updateSettings}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <MosaMotionControl
                connected={connected}
                target={target}
                commandRobot={(destination, interval) =>
                  commandRobot(destination, interval, settings)
                }
              />
              <hr />
              <MosaVibeControl
                connected={connected}
                target={target}
                commandRobot={(destination, interval) =>
                  commandRobot(destination, interval, settings)
                }
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <MosaPlanarControl
                connected={connected}
                commandRobot={(destination, interval) =>
                  commandRobot(destination, interval, settings)
                }
              />
              <hr />
              <MosaRandomControl
                connected={connected}
                target={target}
                commandRobot={(destination, interval) =>
                  commandRobot(destination, interval, settings)
                }
              />
              <hr />
              <MosaSineControl
                connected={connected}
                target={target}
                commandRobot={(destination, interval) =>
                  commandRobot(destination, interval, settings)
                }
              />
            </Grid>
          </Grid>
          &nbsp;
          <Divider />
        </Layout>
      )}
    </SettingsContext.Consumer>
  )
}

export default IndexPage
