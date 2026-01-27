import defaultRecipeImage from '../assets/defaultimage.jpeg'
import { useNavigate } from 'react-router-dom'

type Recipe = {
    id: number
    title: string
    totalTime: number
    imageUrl?: string | null
}

type RecipeCardProps = {
    recipe: Recipe
    onDelete: (id: number) => void
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
    const navigate = useNavigate()

    return (
        <div
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
            <div className="recipe-card-left">
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-time">
                    Total time: {recipe.totalTime} min
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
                            onDelete(recipe.id)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="recipe-card-image-box">
                <img
                    src={recipe.imageUrl || defaultRecipeImage}
                    alt={`${recipe.title} recipe image`}
                    className="recipe-card-image"
                />
            </div>
        </div>
    )
}
