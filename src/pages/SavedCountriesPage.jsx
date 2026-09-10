import { useMemo } from 'react'
import { useLoaderData } from 'react-router'
import SavedCountriesGrid from '../components/SavedCountriesGrid'
import SavedEmptyState from '../components/SavedEmptyState'
import { useAppContext } from '../context/AppContext'

export default function SavedCountriesPage() {
  const { countries } = useLoaderData()
  const {
    savedCountryCodes,
    savedCount,
    clearSavedCountries,
  } = useAppContext()

  const countryByCode = useMemo(
    () => new Map(countries.map((country) => [country.code, country])),
    [countries],
  )

  const savedCountries = useMemo(
    () => savedCountryCodes
      .map((code) => countryByCode.get(code))
      .filter(Boolean),
    [countryByCode, savedCountryCodes],
  )

  const destinationLabel = savedCount === 1 ? 'saved destination' : 'saved destinations'

  return (
    <div className="saved-page shell">
      <section className="saved-hero" aria-labelledby="saved-page-title">
        <div className="saved-hero__copy">
          <p className="eyebrow">My Atlas</p>
          <h1 id="saved-page-title">Countries worth coming back to.</h1>
          <p>
            Keep the places that catch your attention in one personal atlas.
            Your saved routes stay available while you continue exploring.
          </p>
        </div>

        <div className="saved-hero__summary" aria-label={`${savedCount} ${destinationLabel}`}>
          <span className="saved-hero__summary-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M6.75 4.75A2.75 2.75 0 0 1 9.5 2h5A2.75 2.75 0 0 1 17.25 4.75V21L12 17.65 6.75 21V4.75Z" />
            </svg>
          </span>
          <strong>{savedCount}</strong>
          <span>{destinationLabel}</span>
        </div>
      </section>

      {savedCountries.length ? (
        <section className="saved-collection" aria-labelledby="saved-collection-title">
          <div className="section-heading saved-collection__heading">
            <div>
              <p className="eyebrow">Saved routes</p>
              <h2 id="saved-collection-title">Your personal country collection</h2>
            </div>

            <button
              className="saved-clear-button"
              type="button"
              onClick={clearSavedCountries}
            >
              Clear all
            </button>
          </div>

          <SavedCountriesGrid countries={savedCountries} />
        </section>
      ) : (
        <SavedEmptyState />
      )}
    </div>
  )
}
