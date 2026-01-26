import { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import defaultRecipeImage from '../assets/defaultimage.jpeg'

// Data model
type Recipe = {
    id: number
    title: string
    total_time: number
    image_url?: string | null
}

const Cookbook = () => {
    const navigate = useNavigate()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    async function handleDeleteButton(id: number) {
        try {
            if (!window.confirm('Delete this recipe?')) return

            const response = await fetch(
                `http://localhost:8000/api/recipes/${id}`,
                {
                    method: 'DELETE',
                }
            )
            if (!response.ok) {
                throw new Error(`${response.status}`)
            }
            const newRecipeList = recipes.filter(
                (recipe_item) => recipe_item.id !== id
            )
            setRecipes(newRecipeList)
            // update state with this new list
        } catch (error) {
            console.error('Failed to delete recipe:', error)
        }
    }
    async function fetchRecipes() {
        try {
            const response = await fetch('http://localhost:8000/api/recipes')
            const data = await response.json()
            if (!response.ok) {
                throw new Error(`Failed to fetch recipes: ${response.status}`)
            }
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

    return (
        <div className="cookbook-container">
            <h1 className="cookbook-title">My Cookbook</h1>
            <div className="cookbook-list">
                {recipes.length === 0 && (
                    <p>You don’t have any saved recipes yet.</p>
                )}{' '}
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-card"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                        <div className="recipe-card-left">
                            <div>
                                <strong className="recipe-card-title">
                                    {recipe.title}
                                </strong>
                            </div>
                            <div className="recipe-card-time">
                                Total time: {recipe.total_time} min
                            </div>

                            <div className="recipe-card-actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/recipe/edit/${recipe.id}`)
                                    }}
                                    className="recipe-card-btn edit"
                                >
                                    Edit
                                </button>
                                <button
                                    className="recipe-card-btn delete"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteButton(recipe.id)
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="recipe-card-image-box">
                            <img
                                src={
                                    recipe.image_url
                                        ? recipe.image_url
                                        : defaultRecipeImage
                                }
                                alt={`${recipe.title} recipe image`}
                                className="recipe-card-image"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cookbook
