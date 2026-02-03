import type { AIRecipe, RecipeCreatePayload } from '../../types/recipe.d'
import '../App.css'
import React, { useState } from 'react'

const RecipeGenerator = () => {
    const [aiResult, setAiResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ingredientInput, setIngredientInput] = useState('')
    const [ingredients, setIngredients] = useState<string[]>([])
    const [maxTime, setMaxTime] = useState('')
    const [addStatus, setAddStatus] = useState<{ [key: number]: string }>({})

    const handleAddToCookbook = async (recipe: AIRecipe, idx: number) => {
        setAddStatus((prev) => ({ ...prev, [idx]: 'saving' }))
        const payload: RecipeCreatePayload = {
            title: recipe.name, // title instead of name
            total_time: recipe.total_time, // ensure number
            ingredients: recipe.ingredients.map((i: string) => ({ name: i })), // wrap strings
            instructions: recipe.instructions.map(
                (step: string, idx: number) => ({
                    step_text: step,
                    step_number: idx + 1,
                })
            ),
        }
        try {
            console.log('Adding recipe to cookbook:', recipe)
            const res = await fetch('http://localhost:8000/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            })
            if (!res.ok) throw new Error('Failed to add recipe')
            setAddStatus((prev) => ({ ...prev, [idx]: 'saved' }))
        } catch (err) {
            setAddStatus((prev) => ({ ...prev, [idx]: 'error' }))
        }
    }

    const fetchAI = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const body = {
                ingredients,
                max_time: Number(maxTime),
            }
            const res = await fetch('http://localhost:8000/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error('Failed to fetch AI result')
            const data = await res.json()
            setAiResult(data.result || JSON.stringify(data))
            setAddStatus({})
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddIngredient = (e: React.FormEvent) => {
        e.preventDefault()
        const value = ingredientInput.trim()
        if (value && !ingredients.includes(value)) {
            setIngredients([...ingredients, value])
            setIngredientInput('')
        }
    }

    const handleRemoveIngredient = (idx: number) => {
        setIngredients(ingredients.filter((_, i) => i !== idx))
    }
    const handleReset = () => {
        setIngredientInput('')
        setIngredients([])
        setMaxTime('')
        setError(null)
        setAiResult(null)
    }

    let recipes: AIRecipe[] = []
    if (aiResult) {
        try {
            const parsed =
                typeof aiResult === 'string' ? JSON.parse(aiResult) : aiResult
            if (Array.isArray(parsed)) {
                recipes = parsed
            } else if (parsed.recipes && Array.isArray(parsed.recipes)) {
                recipes = parsed.recipes
            }
        } catch (e) {
            console.error('Failed to parse aiResult', e)
        }
    }

    return (
        <div className="rg-root-font">
            <h1>Hungry? Let’s Find a Recipe!</h1>
            {error && (
                <div className="rg-error">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <form onSubmit={fetchAI} className="rg-form">
                <div className="rg-form-row">
                    <label style={{ marginRight: 0 }}>
                        Add your ingredients:
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <input
                                type="text"
                                value={ingredientInput}
                                onChange={(e) =>
                                    setIngredientInput(e.target.value)
                                }
                                className="rg-input rg-input-ingredients"
                                placeholder="e.g. chicken"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddIngredient(e)
                                    }
                                }}
                            />
                            <button
                                onClick={handleAddIngredient}
                                className="rg-add-btn"
                                type="button"
                                disabled={!ingredientInput.trim()}
                            >
                                ➕
                            </button>
                        </span>
                    </label>
                </div>
                {ingredients.length > 0 && (
                    <div className="rg-form-row">
                        {/* <strong>Ingredients List:</strong> */}
                        <ul className="rg-recipe-list">
                            {ingredients.map((ing, idx) => (
                                <li
                                    key={idx}
                                    className="rg-ingredient-list-item"
                                >
                                    <span>{ing}</span>
                                    <button
                                        type="button"
                                        className="rg-remove-btn"
                                        onClick={() =>
                                            handleRemoveIngredient(idx)
                                        }
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="rg-form-row">
                    <label>
                        Total time (minutes):
                        <input
                            type="number"
                            value={maxTime}
                            onChange={(e) => setMaxTime(e.target.value)}
                            className="rg-input rg-input-time"
                            min="1"
                        />
                    </label>
                </div>
                <div className="rg-btn-row">
                    <button
                        type="submit"
                        disabled={loading || ingredients.length === 0}
                        className="rg-btn"
                    >
                        {loading ? 'Loading...' : 'Generate Recipes'}
                    </button>
                    <button
                        type="button"
                        className="rg-btn rg-reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </form>
            {recipes.length > 0 && (
                <div>
                    {recipes.map((recipe, idx) => (
                        <div key={idx} className="rg-recipe-card">
                            <h2 className="rg-recipe-title">{recipe.name}</h2>
                            <div className="rg-form-row">
                                <strong>Total Time:</strong> {recipe.total_time}{' '}
                                minutes
                            </div>
                            {recipe.ingredients &&
                                recipe.ingredients.length > 0 && (
                                    <div className="rg-form-row">
                                        <strong>Ingredients:</strong>
                                        <ul className="rg-ai-ingredients">
                                            {recipe.ingredients.map(
                                                (ing: string, i: number) => (
                                                    <li key={i}>{ing}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            {recipe.instructions &&
                                recipe.instructions.length > 0 && (
                                    <div className="rg-recipe-instructions">
                                        <strong>Instructions:</strong>
                                        <ol className="rg-recipe-list rg-recipe-list-numbers">
                                            {recipe.instructions.map(
                                                (step: string, i: number) => (
                                                    <li key={i}>{step}</li>
                                                )
                                            )}
                                        </ol>
                                    </div>
                                )}

                            <button
                                className="rg-add-cookbook-btn"
                                onClick={() => handleAddToCookbook(recipe, idx)}
                                disabled={
                                    addStatus[idx] === 'saving' ||
                                    addStatus[idx] === 'saved'
                                }
                            >
                                {' '}
                                {addStatus[idx] === 'saved'
                                    ? 'Added!'
                                    : addStatus[idx] === 'saving'
                                      ? 'Adding...'
                                      : 'Add to Cookbook'}
                            </button>
                            {addStatus[idx] === 'error' && (
                                <div style={{ color: 'red', marginTop: 4 }}>
                                    Error adding recipe.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {aiResult && recipes.length === 0 && !loading && (
                <div>
                    <pre>{aiResult}</pre>
                </div>
            )}
        </div>
    )
}

export default RecipeGenerator
