import React, { useRef, useEffect } from 'react'

import { Card, Typography, CardContent } from '@material-ui/core'
import {
  Canvas,
  useFrame,
  useThree,
  perspectiveCamera,
} from 'react-three-fiber'

const Cylinder = props => {
  const mesh = useRef()
  const { L0, L1, L2, R1, R2 } = props.target

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}
      position={[
        -1.5 + (L2 / 1000) * 3,
        -1.5 + (L0 / 1000) * 3,
        1.5 - (L1 / 1000) * 3,
      ]}
      rotation={[
        -Math.PI / 4 + ((-R2 / 1000) * Math.PI) / 2,
        Math.PI / 4 + ((R1 / 1000) * Math.PI) / 2,
        Math.PI * 0.5, // (R0 / 1000) * Math.PI // todo: implement R0 Sim
      ]}
    >
      <cylinderBufferGeometry args={[1, 1, 4, 8]} />
      <meshStandardMaterial color={'gray'} />
    </mesh>
  )
}

const Camera = props => {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  // announce camera to system
  useEffect(() => {
    void setDefaultCamera(ref.current)
    ref.current.lookAt(0, 0, 0)
  })
  // update every frame
  useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera ref={ref} position={[0, 0, 8]} {...props} />
}

export const MosaVisualizer = props => {
  const { target } = props

  return (
    <Card>
      <CardContent>
        <Typography>SR-Visualizer</Typography>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Camera />
          <Cylinder target={target} />
        </Canvas>
      </CardContent>
    </Card>
  )
}

export default MosaVisualizer
