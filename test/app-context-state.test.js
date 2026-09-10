import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_APP_CONTEXT_VALUE,
  clearSavedCountriesPreference,
  normalizeCountryCode,
  setUnitSystemPreference,
  toggleSavedCountryPreference,
  toggleThemePreference,
} from '../src/context/appContextState.js'

const basePreferences = () => ({
  theme: 'light',
  unitSystem: 'metric',
  savedCountryCodes: [],
})

test('App Context exposes meaningful defaults', () => {
  assert.equal(DEFAULT_APP_CONTEXT_VALUE.theme, 'light')
  assert.equal(DEFAULT_APP_CONTEXT_VALUE.unitSystem, 'metric')
  assert.deepEqual(DEFAULT_APP_CONTEXT_VALUE.savedCountryCodes, [])
  assert.equal(DEFAULT_APP_CONTEXT_VALUE.savedCount, 0)
  assert.equal(DEFAULT_APP_CONTEXT_VALUE.isCountrySaved('ISL'), false)
  assert.equal(typeof DEFAULT_APP_CONTEXT_VALUE.toggleTheme, 'function')
  assert.equal(typeof DEFAULT_APP_CONTEXT_VALUE.setUnitSystem, 'function')
  assert.equal(typeof DEFAULT_APP_CONTEXT_VALUE.toggleSavedCountry, 'function')
  assert.equal(typeof DEFAULT_APP_CONTEXT_VALUE.clearSavedCountries, 'function')
})

test('country codes are normalized before saved-state operations', () => {
  assert.equal(normalizeCountryCode(' isl '), 'ISL')
  assert.equal(normalizeCountryCode('jpn'), 'JPN')
  assert.equal(normalizeCountryCode(null), '')
})

test('theme toggle switches light and dark without changing unrelated preferences', () => {
  const current = {
    ...basePreferences(),
    savedCountryCodes: ['ISL'],
  }

  const dark = toggleThemePreference(current)
  assert.deepEqual(dark, {
    theme: 'dark',
    unitSystem: 'metric',
    savedCountryCodes: ['ISL'],
  })

  const light = toggleThemePreference(dark)
  assert.equal(light.theme, 'light')
})

test('unit changes return the same object for invalid or already-active values', () => {
  const current = basePreferences()

  assert.strictEqual(setUnitSystemPreference(current, 'metric'), current)
  assert.strictEqual(setUnitSystemPreference(current, 'yards'), current)

  const imperial = setUnitSystemPreference(current, 'imperial')
  assert.notStrictEqual(imperial, current)
  assert.equal(imperial.unitSystem, 'imperial')
})

test('saved-country toggle adds normalized codes and removes them on the next toggle', () => {
  const current = basePreferences()
  const withIceland = toggleSavedCountryPreference(current, ' isl ')

  assert.deepEqual(withIceland.savedCountryCodes, ['ISL'])

  const withoutIceland = toggleSavedCountryPreference(withIceland, 'ISL')
  assert.deepEqual(withoutIceland.savedCountryCodes, [])
})

test('invalid saved-country values are no-op updates', () => {
  const current = {
    ...basePreferences(),
    savedCountryCodes: ['JPN'],
  }

  assert.strictEqual(toggleSavedCountryPreference(current, ''), current)
  assert.strictEqual(toggleSavedCountryPreference(current, null), current)
})

test('clear saved countries avoids a redundant state update when already empty', () => {
  const empty = basePreferences()
  assert.strictEqual(clearSavedCountriesPreference(empty), empty)

  const current = {
    ...basePreferences(),
    savedCountryCodes: ['ISL', 'JPN'],
  }
  const cleared = clearSavedCountriesPreference(current)

  assert.notStrictEqual(cleared, current)
  assert.deepEqual(cleared.savedCountryCodes, [])
})
