import React from 'react'
import {
  Button,
  Card,
  Typography,
  CardContent,
  CardActions,
} from '@material-ui/core'

export const MosaConnect = props => {
  const { connected, enabled, connect, disconnect } = props

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h2">mosa</Typography>
          <Typography variant="h5">a tcode experiment</Typography>
        </CardContent>
        {enabled ? (
          <CardActions>
            {connected ? (
              <Button onClick={disconnect} variant="outlined" color="secondary">
                DISCONNECT MAXSR
              </Button>
            ) : (
              <Button onClick={connect} variant="contained" color="primary">
                CONNECT MAXSR
              </Button>
            )}
          </CardActions>
        ) : (
          <SerialNotAvailable />
        )}
      </Card>
    </div>
  )
}

const SerialNotAvailable = () => {
  return (
    <CardContent>
      <Typography>
        Could not detect serial capabilities. Please use the latest version of
        Chrome, open <code>chrome://flags</code>, and set
        <code>#enable-experimental-web-platform-features</code> (note that these
        are experimental features, use at your own risk, etc etc)
      </Typography>
    </CardContent>
  )
}

export default MosaConnect
