import { useEffect, useState } from 'react'
import '../App.css'
import RecipeCard from '../components/RecipeCard' // import new component
import type { Recipe } from '../../types/recipe'

const Cookbook = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    async function handleDeleteButton(id: number) {
        try {
            if (!window.confirm('Delete this recipe?')) return

            const response = await fetch(
                `http://localhost:8000/api/recipes/${id}`,
                { method: 'DELETE' }
            )
            if (!response.ok) throw new Error(`${response.status}`)

            setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
        } catch (error) {
            console.error('Failed to delete recipe:', error)
        }
    }

    async function fetchRecipes() {
        try {
            const response = await fetch('http://localhost:8000/api/recipes')
            const data = await response.json()
            if (!response.ok)
                throw new Error(`Failed to fetch recipes: ${response.status}`)

            // Debug: log backend response
            console.log('API /recipes response:', data)

            // Map snake_case API data to camelCase for RecipeCard
            const camelData: Recipe[] = data.map((r: any) => ({
                id: r.id,
                title: r.title,
                totalTime: r.total_time,
                imageUrl: r.image_url ?? null,
            }))

            // Debug: log mapped camelData
            console.log('Mapped recipes:', camelData)

            setRecipes(camelData)
            setLoading(false)
        } catch (error) {
            setError(error as Error)
            setLoading(false)
            console.error('Error loading recipes:', error)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    if (error)
        return <div>Something went wrong loading recipes, try again..</div>
    if (loading) return <div>Loading...</div>

    return (
        <div className="cookbook-container">
            <h1 className="cookbook-title">My Cookbook</h1>
            <div className="cookbook-list">
                {recipes.length === 0 && (
                    <p>You don’t have any saved recipes yet.</p>
                )}
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={handleDeleteButton}
                    />
                ))}
            </div>
        </div>
    )
}

export default Cookbook
