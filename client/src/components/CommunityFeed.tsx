import { useEffect, useState } from 'react'
import '../App.css'
import CommunityRecipeCard from '../components/CommunityRecipeCard' // import new component
import type { Recipe } from '../../types/recipe'

const CommunityFeed = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)

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

    async function fetchRecipes() {
        try {
            const response = await fetch('http://localhost:8000/api/recipes')
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
            <h1 className="cookbook-title">The Community Table</h1>
            <p className="title-description">
                AI recipes brought to life by real cooks.
            </p>
            <div className="cookbook-grid">
                {recipes.length === 0 && <p>No saved recipes yet.</p>}
                {recipes.map((recipe) => (
                    <CommunityRecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={() => {}}
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

export default CommunityFeed
