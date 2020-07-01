import React, { useState } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

import { useSerial } from '../hooks/useSerialHook'
import { scaleAxes, constructTCodeCommand } from '../utils/tcode'

import MosaConnect from '../components/MosaComponents/MosaConnect'
import MosaOutputRangeControl from '../components/MosaComponents/MosaOutputRangeControl'
import MosaMotionControl from '../components/MosaComponents/MosaMotionControl'
import MosaMotionGridControl from '../components/MosaComponents/MosaMotionGridControl'
import MosaVibeControl from '../components/MosaComponents/MosaVibeControl'
import MosaSineControl from '../components/MosaComponents/MosaSineControl'

const IndexPage = () => {
  const isSerialAvailable =
    typeof window !== 'undefined' && 'serial' in navigator // https://github.com/gatsbyjs/gatsby/issues/6859

  const [connect, disconnect, writeToSerial] = useSerial()
  const [connected, setConnected] = useState(false)

  const defaultTarget = {
    L0: 500,
    L1: 500,
    L2: 500,
    R0: 500,
    R1: 500,
    R2: 500,
    V0: 0,
    V1: 0,
    V2: 0,
  }
  const [target, setTarget] = useState(defaultTarget)

  const [outputRange, setOutputRange] = useState({
    L0Min: 100,
    L0Max: 900,
    L1Min: 100,
    L1Max: 900,
    L2Min: 100,
    L2Max: 900,
    R0Min: 250,
    R0Max: 750,
    R1Min: 250,
    R1Max: 750,
    R2Min: 250,
    R2Max: 750,
    V0Min: 0,
    V0Max: 900,
    V1Min: 0,
    V1Max: 900,
    V2Min: 0,
    V2Max: 900,
  })

  const handleConnect = async () => {
    try {
      await connect()
      setConnected(true)
    } catch (e) {
      console.error(e)
      // TODO: set error state, create/catch via error boundary?
    }
  }
  const handleDisconnect = async () => {
    commandRobot(defaultTarget, 1)
    await disconnect()
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
          <MosaConnect
            connected={connected}
            enabled={isSerialAvailable}
            connect={handleConnect}
            disconnect={handleDisconnect}
          />
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
