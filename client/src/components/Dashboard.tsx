import '../App.css'
import React, { useState } from 'react'

const Dashboard = () => {
    const [aiResult, setAiResult] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ingredients, setIngredients] = useState('')
    const [maxTime, setMaxTime] = useState('')

    const fetchAI = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const body = {
                ingredients: ingredients
                    .split(',')
                    .map((i) => i.trim())
                    .filter(Boolean),
                max_time: Number(maxTime),
            }
            const res = await fetch('http://localhost:8000/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error('Failed to fetch AI result')
            const data = await res.json()
            setAiResult(data.result || JSON.stringify(data))
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    let recipes: Array<{
        name: string
        ingredients: string[]
        instructions: string[]
        total_time: number
    }> = []
    if (aiResult) {
        try {
            const parsed =
                typeof aiResult === 'string' ? JSON.parse(aiResult) : aiResult
            if (parsed && Array.isArray(parsed.recipes)) {
                recipes = parsed.recipes
            }
        } catch (e) {
            // fallback: not valid JSON
        }
    }
    return (
        <div>
            <h1>Dashboard Page</h1>
            {error && (
                <div
                    style={{
                        color: 'white',
                        background: 'red',
                        padding: 12,
                        borderRadius: 6,
                        marginBottom: 16,
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}
            <form onSubmit={fetchAI} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Ingredients (comma separated):
                        <input
                            type="text"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            style={{ marginLeft: 8, padding: 4, width: 250 }}
                            placeholder="e.g. chicken, rice, broccoli"
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>
                        Max Time (minutes):
                        <input
                            type="number"
                            value={maxTime}
                            onChange={(e) => setMaxTime(e.target.value)}
                            style={{ marginLeft: 8, padding: 4, width: 100 }}
                            min="1"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginBottom: 16,
                        padding: '8px 16px',
                        fontSize: 16,
                        background: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Loading...' : 'Generate Recipes'}
                </button>
            </form>
            {recipes.length > 0 && (
                <div>
                    {recipes.map((recipe, idx) => (
                        <div
                            key={idx}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: 8,
                                padding: 20,
                                marginBottom: 24,
                                background: '#fafbfc',
                            }}
                        >
                            <h2 style={{ marginBottom: 8 }}>{recipe.name}</h2>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Total Time:</strong> {recipe.total_time}{' '}
                                min
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Ingredients:</strong>
                                <ul style={{ margin: '4px 0 8px 20px' }}>
                                    {recipe.ingredients.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong>Instructions:</strong>
                                <ol style={{ margin: '4px 0 0 20px' }}>
                                    {recipe.instructions.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
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

export default Dashboard
