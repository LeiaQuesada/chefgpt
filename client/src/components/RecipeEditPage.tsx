import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { RecipeDetailsProps, RecipeEditPayload } from '../../types/recipe'
import { useUser } from '../authentication/useUser'

function mapStringArray(
    arr: unknown[],
    type: 'ingredient' | 'instruction'
): string[] {
    if (!Array.isArray(arr)) return []
    return arr
        .map((item) => {
            if (typeof item === 'string') return item
            if (item && typeof item === 'object') {
                if (
                    type === 'ingredient' &&
                    'name' in item &&
                    typeof (item as { name?: unknown }).name === 'string'
                ) {
                    return (item as { name: string }).name
                }
                if (type === 'instruction') {
                    if (
                        'step_text' in item &&
                        typeof (item as { step_text?: unknown }).step_text ===
                            'string'
                    ) {
                        return (item as { step_text: string }).step_text
                    }
                    if (
                        'step' in item &&
                        typeof (item as { step?: unknown }).step === 'string'
                    ) {
                        return (item as { step: string }).step
                    }
                }
            }
            return ''
        })
        .filter((s): s is string => typeof s === 'string')
}

async function updateRecipe(
    recipeId: number,
    payload: RecipeEditPayload
): Promise<RecipeDetailsProps> {
    const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
    })
    let responseBody
    try {
        responseBody = await response.json()
    } catch {
        responseBody = null
    }
    if (!response.ok) {
        throw new Error(
            (responseBody && responseBody.detail) ||
                `Failed to update recipe (status ${response.status})`
        )
    }
    return responseBody
}

export default function RecipeEditPage() {
    const params = useParams<{ id?: string }>()
    const navigate = useNavigate()
    const { user } = useUser()
    let recipeId: number | null = null
    if (typeof params.id === 'string' && /^\d+$/.test(params.id)) {
        recipeId = parseInt(params.id, 10)
    }
    const [form, setForm] = useState<RecipeDetailsProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!recipeId) {
            setError('Invalid recipe ID')
            setLoading(false)
            return
        }
        async function fetchRecipe() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(`/api/recipes/${recipeId}`)
                if (!res.ok) throw new Error('Failed to fetch recipe')
                const data = await res.json()
                const mapped = {
                    id: data.id,
                    title: data.title,
                    imageUrl: data.image_url ?? null,
                    totalTime: data.total_time,
                    ingredients: mapStringArray(data.ingredients, 'ingredient'),
                    instructions: mapStringArray(
                        data.instructions,
                        'instruction'
                    ),
                }
                setForm(mapped)
            } catch (err) {
                setError((err as Error).message || 'Error loading recipe')
            } finally {
                setLoading(false)
            }
        }
        fetchRecipe()
    }, [recipeId])

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof RecipeDetailsProps
    ) {
        if (!form) return
        let value: string | number = e.target.value
        if (field === 'totalTime') {
            value = Number(value)
        }
        setForm({ ...form, [field]: value })
    }

    function handleIngredientChange(idx: number, value: string) {
        if (!form) return
        const newIngredients = Array.isArray(form.ingredients)
            ? [...form.ingredients]
            : []
        newIngredients[idx] = value
        setForm({ ...form, ingredients: newIngredients })
    }

    function handleInstructionChange(idx: number, value: string) {
        if (!form) return
        const newInstructions = Array.isArray(form.instructions)
            ? [...form.instructions]
            : []
        newInstructions[idx] = value
        setForm({ ...form, instructions: newInstructions })
    }

    async function handleSave() {
        if (!form || !user) return
        setLoading(true)
        setError(null)
        const payload = {
            title: form.title,
            image_url: form.imageUrl,
            total_time: form.totalTime,
            user_id: user.id, // Pass user_id from context
            ingredients: Array.isArray(form.ingredients)
                ? form.ingredients.map((name) => ({ name }))
                : [],
            instructions: Array.isArray(form.instructions)
                ? form.instructions.map((step_text, idx) => ({
                      step_text,
                      step_number: idx + 1,
                  }))
                : [],
        }
        try {
            await updateRecipe(form.id, payload)
            navigate(`/recipe/${form.id}`)
        } catch (err) {
            setError((err as Error).message || 'Update failed')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!form) return <div>Recipe not found</div>

    return (
        <>
            <h2>{form.title}</h2>
            <label>
                Recipe Title
                <input
                    id={form.title}
                    value={form.title}
                    onChange={(e) => handleChange(e, 'title')}
                    placeholder="Title"
                />
            </label>
            <label>
                Image:
                <input
                    value={form.imageUrl || ''}
                    onChange={(e) => handleChange(e, 'imageUrl')}
                    placeholder="Image URL"
                />
            </label>
            <label>
                Total Time (min):
                <input
                    type="number"
                    value={form.totalTime}
                    onChange={(e) => handleChange(e, 'totalTime')}
                    placeholder="Total Time (min)"
                />
            </label>
            <h3>Ingredients</h3>
            <ul>
                {(form.ingredients || []).map((ingredient, idx) => (
                    <li key={idx}>
                        <input
                            value={ingredient}
                            onChange={(e) =>
                                handleIngredientChange(idx, e.target.value)
                            }
                        />
                    </li>
                ))}
            </ul>
            <h3>Instructions</h3>
            <ol>
                {(form.instructions || []).map((step, idx) => (
                    <li key={idx}>
                        <textarea
                            value={step}
                            onChange={(e) =>
                                handleInstructionChange(idx, e.target.value)
                            }
                        />
                    </li>
                ))}
            </ol>
            <button onClick={handleSave} disabled={loading}>
                Save
            </button>
            <button onClick={() => navigate(-1)} disabled={loading}>
                Cancel
            </button>
            {error && <div className="error">{error}</div>}
        </>
    )
}
