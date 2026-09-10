import { useMemo } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import HeroSlider from '../components/HeroSlider'
import CountryCard from '../components/CountryCard'

const regions = ['all', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania']
const PAGE_SIZE = 15

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const items = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) items.push('start-ellipsis')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < totalPages - 1) items.push('end-ellipsis')

  items.push(totalPages)
  return items
}

export default function CountriesPage() {
  const { countries } = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const region = searchParams.get('region') ?? 'all'

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return countries.filter((country) => {
      const regionMatch = region === 'all' || country.region.toLowerCase() === region.toLowerCase()
      const queryMatch =
        !normalizedQuery ||
        `${country.name} ${country.capital} ${country.code}`.toLowerCase().includes(normalizedQuery)
      return regionMatch && queryMatch
    })
  }, [countries, query, region])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1
  const firstItemIndex = (currentPage - 1) * PAGE_SIZE
  const visibleCountries = filtered.slice(firstItemIndex, firstItemIndex + PAGE_SIZE)
  const paginationItems = getPaginationItems(currentPage, totalPages)

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    next.delete('page')
    setSearchParams(next)
  }

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    const next = new URLSearchParams(searchParams)
    if (nextPage === 1) next.delete('page')
    else next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <>
      <HeroSlider />

      <section className="shell explorer-section">
        <div className="section-heading explorer-heading">
          <div>
            <p className="eyebrow">Country explorer</p>
            <h2>Find your next route</h2>
          </div>
          <span>{filtered.length} destinations</span>
        </div>

        <div className="catalog-controls">
          <label className="catalog-search">
            <span aria-hidden="true">⌕</span>
            <input
              id="country-catalog-search"
              name="country-catalog-search"
              type="search"
              value={query}
              placeholder="Search by country, capital or code"
              autoComplete="off"
              onChange={(event) => updateParam('q', event.target.value)}
            />
          </label>

          <div className="region-tabs" aria-label="Filter by region">
            {regions.map((item) => {
              const active = region.toLowerCase() === item.toLowerCase()
              return (
                <button
                  key={item}
                  type="button"
                  className={active ? 'region-tab region-tab--active' : 'region-tab'}
                  aria-pressed={active}
                  onClick={() => updateParam('region', item)}
                >
                  {item === 'all' ? 'All' : item}
                </button>
              )
            })}
          </div>
        </div>

        {filtered.length ? (
          <>
            <div className="country-grid">
              {visibleCountries.map((country) => <CountryCard key={country.code} country={country} />)}
            </div>

            {totalPages > 1 && (
              <nav className="catalog-pagination" aria-label="Countries pagination">
                <button
                  type="button"
                  className="catalog-pagination__nav"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ←
                </button>

                <div className="catalog-pagination__pages">
                  {paginationItems.map((item) => (
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        type="button"
                        className={item === currentPage ? 'catalog-pagination__page catalog-pagination__page--active' : 'catalog-pagination__page'}
                        onClick={() => goToPage(item)}
                        aria-current={item === currentPage ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item} className="catalog-pagination__ellipsis" aria-hidden="true">…</span>
                    )
                  ))}
                </div>

                <button
                  type="button"
                  className="catalog-pagination__nav"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  →
                </button>
              </nav>
            )}

          </>
        ) : (
          <div className="empty-state">
            <strong>No countries found</strong>
            <p>Try another name or remove the current region filter.</p>
          </div>
        )}
      </section>
    </>
  )
}
