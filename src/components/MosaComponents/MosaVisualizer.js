import React, { useRef, useEffect } from 'react'

import { Card, Typography, CardContent } from '@material-ui/core'
import { Canvas, useFrame, useThree } from 'react-three-fiber'

const Cylinder = props => {
  const mesh = useRef()
  const { L0, L1, L2, R1, R2 } = props.target

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}
      position={[
        1.5 - (L2 / 1000) * 3 + Math.sin((R1 / 1000 - 0.5) * Math.PI),
        -1.5 + (L0 / 1000) * 3,
        1.5 - (L1 / 1000) * 3 - Math.sin((R2 / 1000 - 0.5) * Math.PI),
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

// Courtesy of @V91 on Discord, 2021-01-24
const RotationIndicator = props => {
  const mesh = useRef()
  const { L0, L1, L2, R0, R1, R2 } = props.target

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}
      position={[
        1.5 - (L2 / 1000) * 3 + Math.sin((R1 / 1000 - 0.5) * Math.PI),
        -1.5 + (L0 / 1000) * 3,
        1.5 - (L1 / 1000) * 3 - Math.sin((R2 / 1000 - 0.5) * Math.PI),
      ]}
      rotation={[
        -Math.PI / 4 + ((-R2 / 1000) * Math.PI) / 2,
        Math.PI * (3 / 4) + ((R1 / 1000) * Math.PI) / 2,
        Math.PI * 0.5 + (-R0 / 1000) * Math.PI * (135 / 90) - 0.8, // Tip cylinder forward + Rotation * 90 degrees * convert 90 to 135 degrees - offset back to center
      ]}
    >
      <cylinderBufferGeometry args={[0.2, 0.2, 2.5, 8]} />
      <meshStandardMaterial color={'red'} />
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
          <RotationIndicator target={target} />
        </Canvas>
      </CardContent>
    </Card>
  )
}

export default MosaVisualizer
