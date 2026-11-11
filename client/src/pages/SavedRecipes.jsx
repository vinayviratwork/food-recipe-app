import { useState, useEffect } from 'react'
import { BookmarkCheck, Loader2 } from 'lucide-react'
import api from '../utils/api'
import RecipeCard from '../components/RecipeCard'
import RecipeModal from '../components/RecipeModal'
import './SavedRecipes.css'

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  const fetchSaved = async () => {
    setLoading(true)
    try {
      const res = await api.get('/recipes/user/saved')
      setRecipes(res.data.recipes)
    } catch { setRecipes([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSaved() }, [])

  const handleDelete = (id) => setRecipes(prev => prev.filter(r => r._id !== id))

  return (
    <div className="saved-page container">
      <div className="saved-header">
        <BookmarkCheck size={28} className="saved-icon" />
        <div>
          <h1>Saved Recipes</h1>
          <p>{loading ? '…' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} saved`}</p>
        </div>
      </div>

      {loading ? (
        <div className="saved-loading">
          <Loader2 size={32} className="spin" />
          <p>Loading your saved recipes…</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="saved-empty">
          <span className="saved-empty-icon">🔖</span>
          <h3>No saved recipes yet</h3>
          <p>Tap the bookmark icon on any recipe to save it here</p>
        </div>
      ) : (
        <div className="saved-grid">
          {recipes.map(r => (
            <RecipeCard key={r._id} recipe={{ ...r, _saved: true }}
              onClick={setSelected} onSaveToggle={fetchSaved} />
          ))}
        </div>
      )}

      {selected && (
        <RecipeModal recipe={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
      )}
    </div>
  )
}
