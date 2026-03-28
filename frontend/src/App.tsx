import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Leaf, Calculator, BarChart2, Github, Users } from 'lucide-react'

import { searchSpecies } from './api'
import type { Species, SearchFilters, SearchResponse } from './types'
import { LangProvider, useLang } from './LangContext'
import { LANGS } from './i18n'

import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import SpeciesCard from './components/SpeciesCard'
import SpeciesModal from './components/SpeciesModal'
import CarbonCalculator from './components/CarbonCalculator'
import StatsPage from './components/StatsPage'

const DEFAULT_FILTERS: SearchFilters = {
  q: '',
  plant_types: [],
  climate_zone: '',
  drought_tolerance_min: 1,
  cold_tolerance_min: 1,
  shade_tolerance_min: 1,
  evergreen: '',
  landscape_use: '',
  height_max: '',
}

const LIMIT = 20

// ── 홈 페이지 ──────────────────────────────────────────────────────────

function HomePage() {
  const { t } = useLang()
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [result, setResult] = useState<SearchResponse | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [selected, setSelected] = useState<Species | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  const fetchData = useCallback(async (f: SearchFilters, pageNum: number) => {
    setLoading(true)
    try {
      const res = await searchSpecies(f, LIMIT, pageNum * LIMIT)
      setResult(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setInitLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      setDebouncedFilters(filters)
    }, 300)
  }, [filters])

  useEffect(() => {
    fetchData(debouncedFilters, page)
  }, [debouncedFilters, page, fetchData])

  const totalPages = result ? Math.ceil(result.total / LIMIT) : 0

  return (
    <>
      {/* 히어로 */}
      <div className="hero">
        <div className="hero-bg-icon">🌿</div>
        <h2>PlantOntology</h2>
        <p>{t.hero_tagline}</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">{result ? result.total.toLocaleString() : '—'}</div>
            <div className="label">{t.stat_results}</div>
          </div>
          <div className="hero-stat">
            <div className="num">45</div>
            <div className="label">{t.stat_datasets}</div>
          </div>
          <div className="hero-stat">
            <div className="num">10</div>
            <div className="label">{t.stat_climates}</div>
          </div>
        </div>
      </div>

      {/* 레이아웃 */}
      <div className="main-layout">
        <FilterPanel filters={filters} onChange={setFilters} />

        <div className="results-area">
          <SearchBar
            value={filters.q}
            onChange={q => setFilters(prev => ({ ...prev, q }))}
            total={result?.total ?? 0}
            loading={loading}
            placeholder={t.search_placeholder}
          />

          {initLoading ? (
            <div className="spinner-wrap">
              <div className="spinner" />
              <span>{t.loading}</span>
            </div>
          ) : result && result.results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>{t.empty_title}</h3>
              <p>{t.empty_body}</p>
            </div>
          ) : (
            <>
              <div className="species-grid">
                {(result?.results ?? []).map((sp, i) => (
                  <SpeciesCard
                    key={sp.id}
                    species={sp}
                    onClick={setSelected}
                    style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    ‹
                  </button>

                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = i
                    } else if (page < 4) {
                      pageNum = i
                    } else if (page > totalPages - 5) {
                      pageNum = totalPages - 7 + i
                    } else {
                      pageNum = page - 3 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${pageNum === page ? 'active' : ''}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    )
                  })}

                  <button
                    className="page-btn"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    ›
                  </button>

                  <span className="page-info">
                    {page + 1} / {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <SpeciesModal species={selected} onClose={() => setSelected(null)} />
    </>
  )
}

// ── 네브바 ──────────────────────────────────────────────────────────────

function Navbar() {
  const { lang, setLang, t } = useLang()

  return (
    <nav className="navbar">
      <a
        href="https://github.com/AlexAI-MCP/PlantOntology"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar-brand"
      >
        <div className="logo-icon">P</div>
        <h1>PlantOntology</h1>
      </a>

      <div className="navbar-links">
        <NavLink to="/" end>
          <Leaf size={15} />
          {t.nav_species}
        </NavLink>
        <NavLink to="/calculator">
          <Calculator size={15} />
          {t.nav_carbon}
        </NavLink>
        <NavLink to="/stats">
          <BarChart2 size={15} />
          {t.nav_stats}
        </NavLink>

        {/* 구분선 */}
        <span className="nav-divider" />

        {/* 커뮤니티 */}
        <a
          href="https://open.kakao.com/o/gm2q2rnh"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-community-btn"
        >
          <Users size={14} />
          {t.nav_community}
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/AlexAI-MCP/PlantOntology"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-icon-btn"
          aria-label="GitHub"
        >
          <Github size={18} />
        </a>

        {/* 언어 토글 */}
        <div className="lang-toggle">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              className={`lang-btn ${lang === code ? 'active' : ''}`}
              onClick={() => setLang(code)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ── 앱 루트 ──────────────────────────────────────────────────────────

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CarbonCalculator />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>

        <footer className="footer">
          PlantOntology — Open-source plant knowledge graph · CC BY 4.0
        </footer>
      </BrowserRouter>
    </LangProvider>
  )
}
