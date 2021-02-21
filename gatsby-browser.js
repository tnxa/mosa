/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react'
import { MosaProvider } from './src/context/MosaContext'

require('typeface-roboto')

export const wrapRootElement = ({ element }) => (
  <MosaProvider>{element}</MosaProvider>
)
