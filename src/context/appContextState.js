import { DEFAULT_PREFERENCES } from '../utils/preferencesStorage.js'

const VALID_UNIT_SYSTEMS = new Set(['metric', 'imperial'])
const noop = () => {}

export const DEFAULT_APP_CONTEXT_VALUE = Object.freeze({
  theme: DEFAULT_PREFERENCES.theme,
  unitSystem: DEFAULT_PREFERENCES.unitSystem,
  savedCountryCodes: Object.freeze([]),
  savedCount: 0,
  toggleTheme: noop,
  setUnitSystem: noop,
  toggleSavedCountry: noop,
  isCountrySaved: () => false,
  clearSavedCountries: noop,
})

export const normalizeCountryCode = (code) => (
  typeof code === 'string' ? code.trim().toUpperCase() : ''
)

export const toggleThemePreference = (current) => ({
  ...current,
  theme: current.theme === 'dark' ? 'light' : 'dark',
})

export const setUnitSystemPreference = (current, unitSystem) => {
  if (!VALID_UNIT_SYSTEMS.has(unitSystem) || current.unitSystem === unitSystem) {
    return current
  }

  return {
    ...current,
    unitSystem,
  }
}

export const toggleSavedCountryPreference = (current, code) => {
  const normalizedCode = normalizeCountryCode(code)
  if (!normalizedCode) return current

  const isSaved = current.savedCountryCodes.includes(normalizedCode)

  return {
    ...current,
    savedCountryCodes: isSaved
      ? current.savedCountryCodes.filter((savedCode) => savedCode !== normalizedCode)
      : [...current.savedCountryCodes, normalizedCode],
  }
}

export const clearSavedCountriesPreference = (current) => {
  if (!current.savedCountryCodes.length) return current

  return {
    ...current,
    savedCountryCodes: [],
  }
}
