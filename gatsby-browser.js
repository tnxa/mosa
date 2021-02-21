/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from 'react'
import { SettingsProvider } from './src/context/SettingsContext'

require('typeface-roboto')

export const wrapRootElement = ({ element }) => (
  <SettingsProvider>{element}</SettingsProvider>
)
