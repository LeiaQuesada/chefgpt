import { useEffect, useState } from 'react'
import RecipeCard from './recipeCard'
import '../App.css'
import { useNavigate } from 'react-router'

// Data model
type Recipe = {
    id: number
    title: string
    totalTime: number
    imageUrl?: string | null
}

export default function Cookbook() {
    const navigate = useNavigate() // Removed unused variable
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    // const handleView = (id: number) => {
    //     navigate(`/recipe/${id}`)
    // }

    // const handleEdit = (id: number) => {
    //     navigate(`/recipe/edit/${id}`)
    // }

    // const handleDelete = (id: number) => {
    //     setRecipes((recipes) => recipes.filter((r) => r.id !== id))
    // }

    // ======================

    async function fetchRecipes() {
        try {
            const response = await fetch('http://localhost:8000/api/recipes')
            const data = await response.json()
            setRecipes(data)
            console.log('Fetched recipes:', data)
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

    if (error) {
        return <div>Something went wrong loading recipes, try again..</div>
    }
    if (loading) {
        return <div>Loading...</div>
    }

    // =======================

    return (
        <div className="cookbook-container">
            <h1 className="cookbook-title">My Cookbook</h1>
            <div className="cookbook-list">
                {/* Render RecipeCard for each recipe */}
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onView={(id) => {
                            /* handle view */
                        }}
                        onEdit={(id) => {
                            /* handle edit */
                        }}
                        onDelete={(id) => {
                            /* handle delete */
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
