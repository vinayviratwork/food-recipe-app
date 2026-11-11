import { useState, useEffect } from 'react'
import { X, Clock, Users, Star, ChefHat, Tag, BookOpen, Utensils, Trash2, Edit2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './RecipeModal.css'

const STARS = [1, 2, 3, 4, 5]

export default function RecipeModal({ recipe, onClose, onDelete }) {
  const { user, isLoggedIn } = useAuth()
  const [hoveredStar, setHoveredStar] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [rating, setRating] = useState({ avg: recipe.averageRating || 0, total: recipe.totalRatings || 0 })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleRate = async (star) => {
    if (!isLoggedIn) { toast.error('Please log in to rate'); return }
    setUserRating(star)
    try {
      const res = await api.post(`/recipes/${recipe._id}/rate`, { rating: star })
      setRating({ avg: res.data.recipe.averageRating, total: res.data.recipe.totalRatings })
      toast.success('Rating submitted!')
    } catch { toast.error('Could not submit rating') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return
    setDeleting(true)
    try {
      await api.delete(`/recipes/${recipe._id}`)
      toast.success('Recipe deleted')
      onDelete?.(recipe._id)
      onClose()
    } catch { toast.error('Could not delete recipe') }
    finally { setDeleting(false) }
  }

  const isOwner = user?._id === recipe.author?._id || user?.id === recipe.author?._id

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        {/* Header Image */}
        <div className="modal-image">
          {recipe.coverImage ? (
            <img src={recipe.coverImage} alt={recipe.title} />
          ) : (
            <div className="modal-image-placeholder">
              <span style={{ fontSize: '5rem' }}>
                {recipe.category === 'breakfast' ? '🍳' : recipe.category === 'dessert' ? '🍰' : '🍽️'}
              </span>
            </div>
          )}
          <div className="modal-category-badge">{recipe.category}</div>
        </div>

        <div className="modal-content">
          {/* Title Row */}
          <div className="modal-title-row">
            <div>
              <h2 className="modal-title">{recipe.title}</h2>
              <div className="modal-author">
                <div className="author-avatar-sm">{recipe.author?.username?.[0]?.toUpperCase() || <ChefHat size={12} />}</div>
                <span>by {recipe.author?.username || 'Anonymous'}</span>
              </div>
            </div>
            {isOwner && (
              <div className="modal-actions">
                <button className="btn-delete" onClick={handleDelete} disabled={deleting}>
                  <Trash2 size={16} /> {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {recipe.description && <p className="modal-desc">{recipe.description}</p>}

          {/* Quick Stats */}
          <div className="modal-stats">
            <div className="stat-pill">
              <Clock size={16} />
              <span><strong>{recipe.cookingTime}</strong> min</span>
            </div>
            <div className="stat-pill">
              <Users size={16} />
              <span><strong>{recipe.servings}</strong> servings</span>
            </div>
            <div className="stat-pill">
              <BookOpen size={16} />
              <span className={`diff-badge diff-${recipe.difficulty === 'beginner' ? 'green' : recipe.difficulty === 'intermediate' ? 'yellow' : 'red'}`}>
                {recipe.difficulty}
              </span>
            </div>
            <div className="stat-pill rating-pill">
              <Star size={16} fill={rating.avg > 0 ? '#E6940A' : 'none'} color={rating.avg > 0 ? '#E6940A' : '#9A9A90'} />
              <span>{rating.avg > 0 ? `${rating.avg.toFixed(1)} (${rating.total})` : 'No ratings yet'}</span>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="modal-tags-section">
              <div className="section-label"><Tag size={14} /> Tags</div>
              <div className="tags-row">
                {recipe.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
              </div>
            </div>
          )}

          <div className="modal-body-grid">
            {/* Ingredients */}
            <div className="modal-section">
              <div className="section-label"><Utensils size={14} /> Ingredients</div>
              <ul className="ingredients-list">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="ingredient-item">
                    <span className="ing-dot" />
                    <span className="ing-name">{ing.name}</span>
                    <span className="ing-qty">{ing.quantity} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="modal-section">
              <div className="section-label"><BookOpen size={14} /> Instructions</div>
              <ol className="instructions-list">
                {recipe.instructions?.map((step) => (
                  <li key={step.stepNumber} className="instruction-step">
                    <div className="step-number">{step.stepNumber}</div>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Rating */}
          <div className="modal-rating">
            <div className="section-label"><Star size={14} /> Rate this recipe</div>
            <div className="stars-row">
              {STARS.map(s => (
                <button
                  key={s}
                  className={`star-btn ${s <= (hoveredStar || userRating) ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredStar(s)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => handleRate(s)}
                >
                  <Star size={28} fill={s <= (hoveredStar || userRating) ? '#E6940A' : 'none'} />
                </button>
              ))}
              {userRating > 0 && <span className="rated-msg">You rated {userRating}/5 ⭐</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
