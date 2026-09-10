import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_PREFERENCES,
  PREFERENCES_STORAGE_KEY,
  loadPreferences,
  savePreferences,
} from '../src/utils/preferencesStorage.js'

const originalWindow = globalThis.window

const createLocalStorage = () => {
  const values = new Map()

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, String(value))
    },
    removeItem(key) {
      values.delete(key)
    },
    clear() {
      values.clear()
    },
  }
}

const installWindow = () => {
  globalThis.window = { localStorage: createLocalStorage() }
}

const restoreWindow = () => {
  if (originalWindow === undefined) {
    delete globalThis.window
  } else {
    globalThis.window = originalWindow
  }
}

test('loadPreferences returns fresh defaults when no browser storage exists', () => {
  delete globalThis.window
  const preferences = loadPreferences()

  assert.deepEqual(preferences, DEFAULT_PREFERENCES)
  assert.notStrictEqual(preferences.savedCountryCodes, DEFAULT_PREFERENCES.savedCountryCodes)

  restoreWindow()
})

test('stored preferences are validated and saved-country codes are normalized', () => {
  installWindow()
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
    theme: 'dark',
    unitSystem: 'imperial',
    savedCountryCodes: [' isl ', 'JPN', 'isl', 42, ''],
  }))

  assert.deepEqual(loadPreferences(), {
    theme: 'dark',
    unitSystem: 'imperial',
    savedCountryCodes: ['ISL', 'JPN'],
  })

  restoreWindow()
})

test('invalid stored values fall back safely without discarding valid saved countries', () => {
  installWindow()
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify({
    theme: 'neon',
    unitSystem: 'yards',
    savedCountryCodes: ['che'],
  }))

  assert.deepEqual(loadPreferences(), {
    theme: 'light',
    unitSystem: 'metric',
    savedCountryCodes: ['CHE'],
  })

  restoreWindow()
})

test('malformed localStorage JSON falls back to defaults', () => {
  installWindow()
  window.localStorage.setItem(PREFERENCES_STORAGE_KEY, '{broken-json')

  assert.deepEqual(loadPreferences(), DEFAULT_PREFERENCES)

  restoreWindow()
})

test('savePreferences persists a normalized payload', () => {
  installWindow()

  assert.equal(savePreferences({
    theme: 'dark',
    unitSystem: 'imperial',
    savedCountryCodes: [' jpn ', 'JPN', 'isl'],
  }), true)

  const stored = JSON.parse(window.localStorage.getItem(PREFERENCES_STORAGE_KEY))
  assert.deepEqual(stored, {
    theme: 'dark',
    unitSystem: 'imperial',
    savedCountryCodes: ['JPN', 'ISL'],
  })

  restoreWindow()
})
