import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ChefHat, Loader2, Flame, Clock, TrendingUp } from 'lucide-react'
import api from '../utils/api'
import RecipeCard from '../components/RecipeCard'
import RecipeModal from '../components/RecipeModal'
import './Home.css'

const CATEGORIES = [
  { name: 'breakfast', emoji: '🍳', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&auto=format&fit=crop' },
  { name: 'lunch',     emoji: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop' },
  { name: 'dinner',    emoji: '🍽️', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&auto=format&fit=crop' },
  { name: 'dessert',   emoji: '🍰', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop' },
  { name: 'snack',     emoji: '🥨', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop' },
  { name: 'beverage',  emoji: '🧃', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop' },
  { name: 'appetizer', emoji: '🥙', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&auto=format&fit=crop' },
  { name: 'side dish', emoji: '🥘', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&auto=format&fit=crop' },
]

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']
const SORTS = [
  { value: 'newest',      label: '🕐 Newest First' },
  { value: 'popular',     label: '⭐ Most Popular' },
  { value: 'cookingTime', label: '⚡ Quickest' },
]

export default function Home() {
  const [recipes, setRecipes]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [pagination, setPagination] = useState({})
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory]     = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [sort, setSort]             = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const fetchRecipes = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ page, sort, limit: 12 })
      if (search)     params.set('search', search)
      if (category)   params.set('category', category)
      if (difficulty) params.set('difficulty', difficulty)
      const res = await api.get(`/recipes?${params}`)
      setRecipes(res.data.recipes)
      setPagination(res.data.pagination)
    } catch {
      setError('Could not load recipes. Make sure the backend is running on port 5000.')
    } finally { setLoading(false) }
  }, [page, search, category, difficulty, sort])

  useEffect(() => { fetchRecipes() }, [fetchRecipes])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1); setSearch(searchInput)
  }

  const pickCategory = (name) => {
    setCategory(prev => prev === name ? '' : name)
    setPage(1)
    setTimeout(() => document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const clearFilters = () => {
    setCategory(''); setDifficulty(''); setSort('newest')
    setSearch(''); setSearchInput(''); setPage(1)
  }

  const hasFilters = category || difficulty || sort !== 'newest' || search

  const handleDelete = (id) => setRecipes(prev => prev.filter(r => r._id !== id))

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <div className="home-hero">
        <div className="hero-bg-grid">
          {['https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
          ].map((src, i) => (
            <div key={i} className={`hero-bg-img hero-bg-img-${i}`}>
              <img src={src} alt="" />
            </div>
          ))}
          <div className="hero-bg-overlay" />
        </div>

        <div className="container hero-inner">
          <div className="hero-badge"><Flame size={14} /> Trending Recipes</div>
          <h1 className="hero-title">
            Discover & Share<br />
            <span>Delicious Recipes</span>
          </h1>
          <p className="hero-sub">
            Find recipes for every meal, skill level, and craving.<br />
            Join thousands of home chefs sharing their best dishes.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search recipes, ingredients, tags…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="search-input"
              />
              {searchInput && (
                <button type="button" className="search-clear" onClick={() => { setSearchInput(''); setSearch('') }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="hero-stats">
            <div className="hero-stat"><TrendingUp size={15} /> 12 Recipes</div>
            <div className="hero-stat-sep">·</div>
            <div className="hero-stat"><Clock size={15} /> 5 min to 50 min</div>
            <div className="hero-stat-sep">·</div>
            <div className="hero-stat">🌍 World Cuisines</div>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="categories-section">
        <div className="container">
          <div className="section-heading">
            <h2>Browse by Category</h2>
            {category && <button className="clear-cat" onClick={() => { setCategory(''); setPage(1) }}><X size={14} /> Clear</button>}
          </div>
          <div className="category-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                className={`cat-card ${category === cat.name ? 'active' : ''}`}
                onClick={() => pickCategory(cat.name)}
              >
                <div className="cat-img-wrap">
                  <img src={cat.image} alt={cat.name} />
                  <div className="cat-overlay" />
                </div>
                <div className="cat-info">
                  <span className="cat-emoji">{cat.emoji}</span>
                  <span className="cat-name">{cat.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECIPES ── */}
      <div className="container home-body" id="recipes-section">

        {/* Controls bar */}
        <div className="controls-bar">
          <div className="controls-left">
            <h3 className="recipes-heading">
              {category ? `${CATEGORIES.find(c=>c.name===category)?.emoji} ${category.charAt(0).toUpperCase()+category.slice(1)} Recipes` : 'All Recipes'}
            </h3>
            <span className="results-count">
              {loading ? '…' : `${pagination.totalRecipes || 0} found`}
            </span>
            {hasFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <X size={13} /> Clear all
              </button>
            )}
          </div>
          <div className="controls-right">
            <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(p => !p)}>
              <SlidersHorizontal size={15} /> Filters
              {(difficulty) && <span className="filter-dot" />}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-group">
              <div className="filter-label">Difficulty</div>
              <div className="filter-pills">
                {DIFFICULTIES.map(d => (
                  <button key={d} className={`filter-pill ${difficulty === d ? 'active' : ''}`}
                    onClick={() => { setDifficulty(difficulty === d ? '' : d); setPage(1) }}>
                    {d === 'beginner' ? '🟢' : d === 'intermediate' ? '🟡' : '🔴'} {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"><Loader2 size={36} className="spin" /></div>
            <p>Loading recipes…</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Backend not connected</h3>
            <p>{error}</p>
            <button onClick={fetchRecipes} className="retry-btn">Try Again</button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <ChefHat size={52} />
            <h3>No recipes found</h3>
            <p>Try different filters or add the first recipe!</p>
            {hasFilters && <button onClick={clearFilters} className="retry-btn">Clear Filters</button>}
          </div>
        ) : (
          <>
            <div className="recipes-grid">
              {recipes.map(r => (
                <RecipeCard key={r._id} recipe={r} onClick={setSelectedRecipe} onSaveToggle={fetchRecipes} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}>
                  ← Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-num ${p === pagination.currentPage ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  ))}
                </div>
                <button className="page-btn" disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onDelete={handleDelete} />
      )}
    </div>
  )
}
