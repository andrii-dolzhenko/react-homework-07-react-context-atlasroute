import { Link, useLoaderData, useParams } from 'react-router'
import CountryGallery from '../components/CountryGallery'
import RouteMap from '../components/RouteMap'
import AreaValue from '../components/AreaValue'
import SaveCountryButton from '../components/SaveCountryButton'
import useCountryMedia from '../hooks/useCountryMedia'
import { formatNumber, formatPopulation } from '../data/featured'

export default function CountryDetailsPage() {
  const { country } = useLoaderData()
  const { code } = useParams()
  const { images: mediaImages, loading: mediaLoading, error: mediaError } = useCountryMedia(country.name)

  const dynamicHero = country.heroImage || mediaImages[0]?.src || null

  const currency = country.currencies
    .map(({ name, code: currencyCode }) => `${name}${currencyCode ? ` (${currencyCode})` : ''}`)
    .join(', ') || '—'
  const languages = country.languages.map(({ name }) => name).join(', ') || '—'
  const timezone = country.timezones.join(', ') || '—'

  const facts = [
    ['Capital', country.capital],
    ['Region', country.region],
    ['Subregion', country.subregion],
    ['Population', formatNumber(country.population)],
    ['Area', <AreaValue areaKm2={country.area} />],
    ['Currency', currency],
    ['Languages', languages],
    ['Timezone', timezone],
  ]

  return (
    <article className="details-page">
      <section className={`details-hero shell ${dynamicHero ? '' : 'details-hero--flag'}`}>
        {dynamicHero ? (
          <img src={dynamicHero} alt="" className="details-hero__image" />
        ) : (
          <div className="details-hero__flag-visual">
            {country.flagUrl ? <img src={country.flagUrl} alt="" /> : <span>{country.flagEmoji}</span>}
          </div>
        )}
        <div className="details-hero__overlay" />

        <Link className="back-button" to="/countries">← Back to countries</Link>

        <SaveCountryButton
          code={country.code}
          countryName={country.name}
          variant="hero"
        />

        <div className="details-hero__copy">
          <p className="eyebrow">{country.region} / {country.subregion}</p>
          <h1>{country.name}</h1>
          <p>{country.tagline}</p>
        </div>

        <div className="details-kpis">
          <div><span>Capital</span><strong>{country.capital}</strong></div>
          <div><span>Population</span><strong>{formatPopulation(country.population)}</strong></div>
          <div><span>Area</span><strong><AreaValue areaKm2={country.area} /></strong></div>
          <div><span>Code</span><strong>{code?.toUpperCase()}</strong></div>
        </div>
      </section>

      <section className="shell details-content">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>About {country.name}</h2>
          <p className="lead">
            Live country facts are loaded from countries.dev through the route loader.
            The URL parameter determines which country record is requested and rendered.
          </p>

          <dl className="facts-list">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <RouteMap country={country} />
      </section>

      <CountryGallery
        country={country}
        images={mediaImages}
        loading={mediaLoading}
        error={mediaError}
      />

      <section className="shell border-section">
        <p className="eyebrow">Border countries</p>
        <h2>Continue exploring by route</h2>
        {country.borders.length ? (
          <div className="border-links">
            {country.borders.map((borderCode) => (
              <Link key={borderCode} to={`/countries/${borderCode}`}>{borderCode} →</Link>
            ))}
          </div>
        ) : (
          <p className="muted">{country.name} has no land borders.</p>
        )}
      </section>
    </article>
  )
}
