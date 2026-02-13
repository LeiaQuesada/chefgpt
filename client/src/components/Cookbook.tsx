import { useEffect, useState } from 'react'
import '../App.css'
import RecipeCard from '../components/RecipeCard' // import new component
import type { Recipe } from '../../types/recipe'
import { useUser } from '../authentication/useUser'

const Cookbook = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    function handleScrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleDeleteButton(id: number) {
        try {
            if (!window.confirm('Delete this recipe?')) return

            const response = await fetch(`/api/recipes/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error(`${response.status}`)

            setRecipes((prev) => prev.filter((recipe) => recipe.id !== id))
        } catch (error) {
            console.error('Failed to delete recipe:', error)
        }
    }

    async function fetchRecipes() {
        try {
            const response = await fetch(`/api/recipes/user/${user?.id}`)
            const data = await response.json()
            if (!response.ok)
                throw new Error(`Failed to fetch recipes: ${response.status}`)

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
            <p className="title-description">
                Your saved ChefGPT recipes in one place.
            </p>
            <div className="cookbook-grid">
                {recipes.length === 0 && (
                    <p>
                        You don’t have any saved recipes yet. Use the AI Chef to
                        generate and save your custom recipes.
                    </p>
                )}
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={handleDeleteButton}
                    />
                ))}
            </div>
            <button
                className={`scroll-to-top-btn ${showScrollTop ? 'visible' : ''}`}
                aria-label="Scroll to top"
                onClick={handleScrollToTop}
                aria-hidden={!showScrollTop}
            >
                ↑
            </button>
        </div>
    )
}

export default Cookbook
