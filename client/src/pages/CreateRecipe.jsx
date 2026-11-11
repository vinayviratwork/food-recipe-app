import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ChefHat, Loader2 } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import './CreateRecipe.css'

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage', 'appetizer', 'side dish']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export default function CreateRecipe() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', category: '', difficulty: 'intermediate',
    cookingTime: '', servings: 2, coverImage: '', tags: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: [{ stepNumber: 1, description: '' }],
  })

  const updateForm = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addIngredient = () => setForm(p => ({ ...p, ingredients: [...p.ingredients, { name: '', quantity: '', unit: '' }] }))
  const removeIngredient = (i) => setForm(p => ({ ...p, ingredients: p.ingredients.filter((_, idx) => idx !== i) }))
  const updateIngredient = (i, k, v) => setForm(p => {
    const ing = [...p.ingredients]; ing[i] = { ...ing[i], [k]: v }; return { ...p, ingredients: ing }
  })

  const addStep = () => setForm(p => ({ ...p, instructions: [...p.instructions, { stepNumber: p.instructions.length + 1, description: '' }] }))
  const removeStep = (i) => setForm(p => ({ ...p, instructions: p.instructions.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })) }))
  const updateStep = (i, v) => setForm(p => { const ins = [...p.instructions]; ins[i] = { ...ins[i], description: v }; return { ...p, instructions: ins } })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.category || !form.cookingTime) { toast.error('Fill required fields'); return }
    if (form.ingredients.some(i => !i.name || !i.quantity)) { toast.error('Fill all ingredient fields'); return }
    if (form.instructions.some(s => !s.description)) { toast.error('Fill all instruction steps'); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        cookingTime: Number(form.cookingTime),
        servings: Number(form.servings),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      await api.post('/recipes', payload)
      toast.success('Recipe created! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create recipe')
    } finally { setLoading(false) }
  }

  return (
    <div className="create-page container">
      <div className="create-header">
        <ChefHat size={28} className="create-icon" />
        <div>
          <h1>Add New Recipe</h1>
          <p>Share your recipe with the community</p>
        </div>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-section">
          <div className="fs-title">Basic Information</div>
          <div className="form-grid-2">
            <div className="form-group full">
              <label>Recipe Title <span className="req">*</span></label>
              <input type="text" placeholder="e.g. Creamy Pasta Carbonara"
                value={form.title} onChange={e => updateForm('title', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea rows={3} placeholder="Briefly describe your recipe…"
                value={form.description} onChange={e => updateForm('description', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category <span className="req">*</span></label>
              <select value={form.category} onChange={e => updateForm('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cooking Time (minutes) <span className="req">*</span></label>
              <input type="number" min="1" placeholder="30"
                value={form.cookingTime} onChange={e => updateForm('cookingTime', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Servings</label>
              <input type="number" min="1" placeholder="4"
                value={form.servings} onChange={e => updateForm('servings', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Cover Image URL</label>
              <input type="url" placeholder="https://example.com/image.jpg"
                value={form.coverImage} onChange={e => updateForm('coverImage', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Tags <span className="hint">(comma-separated)</span></label>
              <input type="text" placeholder="italian, vegetarian, quick"
                value={form.tags} onChange={e => updateForm('tags', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="form-section">
          <div className="fs-title">Ingredients <span className="req">*</span></div>
          <div className="ingredients-list">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="ingredient-row">
                <input type="text" placeholder="Ingredient name" className="ing-name-input"
                  value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} />
                <input type="text" placeholder="Quantity" className="ing-qty-input"
                  value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)} />
                <input type="text" placeholder="Unit" className="ing-unit-input"
                  value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} />
                {form.ingredients.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeIngredient(i)}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="add-btn" onClick={addIngredient}>
            <Plus size={16} /> Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div className="form-section">
          <div className="fs-title">Instructions <span className="req">*</span></div>
          <div className="steps-list">
            {form.instructions.map((step, i) => (
              <div key={i} className="step-row">
                <div className="step-num">{step.stepNumber}</div>
                <textarea rows={2} placeholder={`Describe step ${step.stepNumber}…`}
                  value={step.description} onChange={e => updateStep(i, e.target.value)} />
                {form.instructions.length > 1 && (
                  <button type="button" className="remove-btn" onClick={() => removeStep(i)}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="add-btn" onClick={addStep}>
            <Plus size={16} /> Add Step
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><Loader2 size={16} className="spin" /> Publishing…</> : '🍳 Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
