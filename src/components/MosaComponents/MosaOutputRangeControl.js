import React from 'react'

import {
  Card,
  CardContent,
  FormGroup,
  Typography,
  Slider,
} from '@material-ui/core'

const MosaOutputRangeControl = props => {
  const { outputRange, setOutputRange } = props

  const handleRangeChange = (axis, value) => {
    const [min, max] = value
    const newValue = {}
    newValue[axis + 'Min'] = min
    newValue[axis + 'Max'] = max
    setOutputRange({ ...outputRange, ...newValue })
  }

  return (
    <Card>
      <CardContent style={{ margin: 8 }}>
        <Typography variant="subtitle1">Output Range</Typography>
        <FormGroup row>
          <Slider
            marks={[
              { value: 100, label: 'L0 @ 100' },
              { value: 900, label: '900' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.L0Min, outputRange.L0Max]}
            onChange={(e, value) => handleRangeChange('L0', value)}
          />
          <Slider
            marks={[
              { value: 100, label: 'L1 @ 100' },
              { value: 900, label: '900' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.L1Min, outputRange.L1Max]}
            onChange={(e, value) => handleRangeChange('L1', value)}
          />
          <Slider
            marks={[
              { value: 100, label: 'L2 @ 100' },
              { value: 900, label: '900' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.L2Min, outputRange.L2Max]}
            onChange={(e, value) => handleRangeChange('L2', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R0' },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.R0Min, outputRange.R0Max]}
            onChange={(e, value) => handleRangeChange('R0', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R1' },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.R1Min, outputRange.R1Max]}
            onChange={(e, value) => handleRangeChange('R1', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R2' },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.R2Min, outputRange.R2Max]}
            onChange={(e, value) => handleRangeChange('R2', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V0' },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.V0Min, outputRange.V0Max]}
            onChange={(e, value) => handleRangeChange('V0', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V1' },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.V1Min, outputRange.V1Max]}
            onChange={(e, value) => handleRangeChange('V1', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V2' },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[outputRange.V2Min, outputRange.V2Max]}
            onChange={(e, value) => handleRangeChange('V2', value)}
          />
        </FormGroup>
      </CardContent>
    </Card>
  )
}

export default MosaOutputRangeControl
