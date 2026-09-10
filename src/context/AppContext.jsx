/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import {
  loadPreferences,
  savePreferences,
} from '../utils/preferencesStorage'
import {
  DEFAULT_APP_CONTEXT_VALUE,
  clearSavedCountriesPreference,
  normalizeCountryCode,
  setUnitSystemPreference,
  toggleSavedCountryPreference,
  toggleThemePreference,
} from './appContextState'

export const AppContext = createContext(DEFAULT_APP_CONTEXT_VALUE)

export function AppProvider({ children }) {
  const [preferences, setPreferences] = useState(loadPreferences)
  const {
    theme,
    unitSystem,
    savedCountryCodes,
  } = preferences

  const toggleTheme = useCallback(() => {
    setPreferences(toggleThemePreference)
  }, [])

  const setUnitSystem = useCallback((nextUnitSystem) => {
    setPreferences((current) => setUnitSystemPreference(current, nextUnitSystem))
  }, [])

  const toggleSavedCountry = useCallback((code) => {
    setPreferences((current) => toggleSavedCountryPreference(current, code))
  }, [])

  const clearSavedCountries = useCallback(() => {
    setPreferences(clearSavedCountriesPreference)
  }, [])

  const savedCountryCodeSet = useMemo(
    () => new Set(savedCountryCodes),
    [savedCountryCodes],
  )

  const isCountrySaved = useCallback((code) => {
    const normalizedCode = normalizeCountryCode(code)
    return normalizedCode ? savedCountryCodeSet.has(normalizedCode) : false
  }, [savedCountryCodeSet])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme

    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) {
      themeColor.setAttribute(
        'content',
        theme === 'dark' ? '#061827' : '#fbfdfe',
      )
    }
  }, [theme])

  useEffect(() => {
    savePreferences(preferences)
  }, [preferences])

  const contextValue = useMemo(() => ({
    theme,
    unitSystem,
    savedCountryCodes,
    savedCount: savedCountryCodes.length,
    toggleTheme,
    setUnitSystem,
    toggleSavedCountry,
    isCountrySaved,
    clearSavedCountries,
  }), [
    theme,
    unitSystem,
    savedCountryCodes,
    toggleTheme,
    setUnitSystem,
    toggleSavedCountry,
    isCountrySaved,
    clearSavedCountries,
  ])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
