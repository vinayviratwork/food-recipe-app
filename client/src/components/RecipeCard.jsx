import { useState } from 'react'
import { Clock, Users, Star, Bookmark, BookmarkCheck, ChefHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './RecipeCard.css'

const FOOD_EMOJIS = {
  breakfast: '🍳', lunch: '🥗', dinner: '🍽️',
  dessert: '🍰', snack: '🥨', beverage: '🧃',
  appetizer: '🥙', 'side dish': '🥘'
}

const DIFF_COLOR = { beginner: 'green', intermediate: 'yellow', advanced: 'red' }

export default function RecipeCard({ recipe, onClick, onSaveToggle }) {
  const { isLoggedIn } = useAuth()
  const [saved, setSaved] = useState(recipe._saved || false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.stopPropagation()
    if (!isLoggedIn) { toast.error('Please log in to save recipes'); return }
    setSaving(true)
    try {
      const res = await api.post(`/recipes/${recipe._id}/save`)
      setSaved(res.data.saved)
      toast.success(res.data.message)
      onSaveToggle?.()
    } catch { toast.error('Could not save recipe') }
    finally { setSaving(false) }
  }

  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="card-image">
        {recipe.coverImage ? (
          <img src={recipe.coverImage} alt={recipe.title} />
        ) : (
          <div className="card-image-placeholder">
            <span>{FOOD_EMOJIS[recipe.category] || '🍴'}</span>
          </div>
        )}
        <div className="card-category">{recipe.category}</div>
        <button
          className={`card-save ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={saving}
          title={saved ? 'Unsave' : 'Save'}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="card-body">
        <div className={`card-diff diff-${DIFF_COLOR[recipe.difficulty]}`}>
          {recipe.difficulty}
        </div>
        <h3 className="card-title">{recipe.title}</h3>
        {recipe.description && (
          <p className="card-desc">{recipe.description}</p>
        )}
        <div className="card-meta">
          <span className="meta-item">
            <Clock size={14} /> {recipe.cookingTime} min
          </span>
          <span className="meta-item">
            <Users size={14} /> {recipe.servings} servings
          </span>
          {recipe.averageRating > 0 && (
            <span className="meta-item meta-rating">
              <Star size={14} fill="currentColor" />
              {recipe.averageRating.toFixed(1)}
              <span className="rating-count">({recipe.totalRatings})</span>
            </span>
          )}
        </div>
        {recipe.tags?.length > 0 && (
          <div className="card-tags">
            {recipe.tags.slice(0, 3).map(t => (
              <span key={t} className="card-tag">{t}</span>
            ))}
          </div>
        )}
        <div className="card-author">
          <div className="author-avatar">
            {recipe.author?.username?.[0]?.toUpperCase() || <ChefHat size={12} />}
          </div>
          <span>{recipe.author?.username || 'Anonymous'}</span>
        </div>
      </div>
    </div>
  )
}
