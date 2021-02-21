/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React, { useState, useEffect } from 'react'
import { defaultRange } from './src/config/defaults'
require('typeface-roboto')

export const SettingsContext = React.createContext()

const Provider = ({ children }) => {
  // store our range settings in localStorage, retrieve them on load.
  const [mosaSettings, setMosaSettings] = useState(defaultRange)

  // once, on load, try to load settings from localStorage
  // if we can't find them, create them in localStorage
  useEffect(() => {
    // we can store strings, not objects, in localstorage
    const existingMosaSettings = JSON.parse(
      localStorage.getItem('mosaSettings')
    )
    if (existingMosaSettings) {
      setMosaSettings(existingMosaSettings)
    } else {
      setMosaSettings(defaultRange)
      // we can store strings, not objects, in localstorage
      localStorage.setItem('mosaSettings', JSON.stringify(defaultRange))
    }
  }, [setMosaSettings])

  const updateSettings = newSettings => {
    setMosaSettings(newSettings)
    localStorage.setItem('mosaSettings', JSON.stringify(newSettings))
  }

  return (
    <SettingsContext.Provider
      value={{
        settings: mosaSettings,
        updateSettings: updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const wrapRootElement = ({ element }) => <Provider>{element}</Provider>
