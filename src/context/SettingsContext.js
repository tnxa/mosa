import React, { useState, useEffect } from 'react'
import { defaultRange } from '../config/defaults'

export const SettingsContext = React.createContext()

export const SettingsProvider = ({ children }) => {
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
