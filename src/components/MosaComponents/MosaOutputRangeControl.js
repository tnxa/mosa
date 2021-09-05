import React from 'react'

import {
  Card,
  CardContent,
  FormGroup,
  Typography,
  Slider,
} from '@material-ui/core'

const MosaOutputRangeControl = props => {
  const { settings, updateSettings } = props

  const handleRangeChange = (axis, value) => {
    const [min, max] = value
    const newValue = {}
    newValue[axis + 'Min'] = min
    newValue[axis + 'Max'] = max
    updateSettings({ ...settings, ...newValue })
  }

  return (
    <Card>
      <CardContent style={{ margin: 8 }}>
        <Typography variant="subtitle1">Output Range</Typography>
        <FormGroup row>
          <Slider
            marks={[
              { value: 0, label: 'L0' },
              {
                value: (settings.L0Min + settings.L0Max) / 2,
                label: settings.L0Min + ' - ' + settings.L0Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.L0Min, settings.L0Max]}
            onChange={(e, value) => handleRangeChange('L0', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'L1' },
              {
                value: (settings.L1Min + settings.L1Max) / 2,
                label: settings.L1Min + ' - ' + settings.L1Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.L1Min, settings.L1Max]}
            onChange={(e, value) => handleRangeChange('L1', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'L2' },
              {
                value: (settings.L2Min + settings.L2Max) / 2,
                label: settings.L2Min + ' - ' + settings.L2Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.L2Min, settings.L2Max]}
            onChange={(e, value) => handleRangeChange('L2', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R0' },
              {
                value: (settings.R0Min + settings.R0Max) / 2,
                label: settings.R0Min + ' - ' + settings.R0Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.R0Min, settings.R0Max]}
            onChange={(e, value) => handleRangeChange('R0', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R1' },
              {
                value: (settings.R1Min + settings.R1Max) / 2,
                label: settings.R1Min + ' - ' + settings.R1Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.R1Min, settings.R1Max]}
            onChange={(e, value) => handleRangeChange('R1', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'R2' },
              {
                value: (settings.R2Min + settings.R2Max) / 2,
                label: settings.R2Min + ' - ' + settings.R2Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.R2Min, settings.R2Max]}
            onChange={(e, value) => handleRangeChange('R2', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V0' },
              {
                value: (settings.V0Min + settings.V0Max) / 2,
                label: settings.V0Min + ' - ' + settings.V0Max,
              },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.V0Min, settings.V0Max]}
            onChange={(e, value) => handleRangeChange('V0', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V1' },
              {
                value: (settings.V1Min + settings.V1Max) / 2,
                label: settings.V1Min + ' - ' + settings.V1Max,
              },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.V1Min, settings.V1Max]}
            onChange={(e, value) => handleRangeChange('V1', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'V2' },
              {
                value: (settings.V2Min + settings.V2Max) / 2,
                label: settings.V2Min + ' - ' + settings.V2Max,
              },
              { value: 999, label: 'MAX' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.V2Min, settings.V2Max]}
            onChange={(e, value) => handleRangeChange('V2', value)}
          />
          <Slider
            marks={[
              { value: 0, label: 'A0' },
              {
                value: (settings.A0Min + settings.A0Max) / 2,
                label: settings.A0Min + ' - ' + settings.A0Max,
              },
              { value: 999, label: '999' },
            ]}
            step={1}
            min={0}
            max={999}
            valueLabelDisplay="auto"
            value={[settings.A0Min, settings.A0Max]}
            onChange={(e, value) => handleRangeChange('A0', value)}
          />
        </FormGroup>
      </CardContent>
    </Card>
  )
}

export default MosaOutputRangeControl
