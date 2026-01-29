import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { RecipeDetailsProps } from '../../types/recipe'
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

export default function RecipeDetails() {
    const params = useParams<{ id?: string }>()
    const navigate = useNavigate()
    const { user } = useUser()
    let recipeId: number | null = null
    if (typeof params.id === 'string' && /^\d+$/.test(params.id)) {
        recipeId = parseInt(params.id, 10)
    }
    const [recipe, setRecipe] = useState<RecipeDetailsProps | null>(null)
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
                    user_id: data.user_id,
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
                setRecipe(mapped)
            } catch (err) {
                setError((err as Error).message || 'Error loading recipe')
            } finally {
                setLoading(false)
            }
        }
        fetchRecipe()
    }, [recipeId])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!recipe) return <div>Recipe not found</div>
    const isOwner = user && recipe.user_id === Number(user.id)

    return (
        <>
            <h2>{recipe.title}</h2>
            {recipe.imageUrl && (
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="image-container"
                />
            )}
            <p>
                <strong>Total Time:</strong> {recipe.totalTime} min
            </p>
            <h3>Ingredients</h3>
            <ul>
                {(recipe.ingredients || []).map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                ))}
            </ul>
            <h3>Instructions</h3>
            <ol>
                {(recipe.instructions || []).map((step, idx) => (
                    <li key={idx}>{step}</li>
                ))}
            </ol>
            {isOwner && (
                <button
                    className="recipe-card-btn edit"
                    onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
                >
                    Edit
                </button>
            )}
        </>
    )
}
