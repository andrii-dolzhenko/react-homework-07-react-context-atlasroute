export const PREFERENCES_STORAGE_KEY = 'atlasroute:preferences:v1'

export const DEFAULT_PREFERENCES = Object.freeze({
  theme: 'light',
  unitSystem: 'metric',
  savedCountryCodes: [],
})

const VALID_THEMES = new Set(['light', 'dark'])
const VALID_UNIT_SYSTEMS = new Set(['metric', 'imperial'])

const normalizeSavedCountryCodes = (value) => {
  if (!Array.isArray(value)) return []

  return [...new Set(
    value
      .filter((code) => typeof code === 'string')
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean),
  )]
}

export const loadPreferences = () => {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_PREFERENCES, savedCountryCodes: [] }
  }

  try {
    const storedValue = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (!storedValue) return { ...DEFAULT_PREFERENCES, savedCountryCodes: [] }

    const parsedValue = JSON.parse(storedValue)

    return {
      theme: VALID_THEMES.has(parsedValue?.theme)
        ? parsedValue.theme
        : DEFAULT_PREFERENCES.theme,
      unitSystem: VALID_UNIT_SYSTEMS.has(parsedValue?.unitSystem)
        ? parsedValue.unitSystem
        : DEFAULT_PREFERENCES.unitSystem,
      savedCountryCodes: normalizeSavedCountryCodes(parsedValue?.savedCountryCodes),
    }
  } catch {
    return { ...DEFAULT_PREFERENCES, savedCountryCodes: [] }
  }
}

export const savePreferences = (preferences) => {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        theme: preferences.theme,
        unitSystem: preferences.unitSystem,
        savedCountryCodes: normalizeSavedCountryCodes(preferences.savedCountryCodes),
      }),
    )
    return true
  } catch {
    return false
  }
}
