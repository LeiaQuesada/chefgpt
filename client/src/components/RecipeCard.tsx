import defaultRecipeImage from '../assets/defaultimage.jpeg'
import clockIcon from '../assets/clock.svg'
import editIcon from '../assets/edit.svg'
import deleteIcon from '../assets/delete.svg'
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
            <div className="recipe-card-image-box">
                <img
                    src={recipe.imageUrl || defaultRecipeImage}
                    alt={`${recipe.title} recipe image`}
                    className="recipe-card-image"
                />
            </div>
            <div className="recipe-card-content">
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-time time-row">
                    <img src={clockIcon} alt="clock" className="icon-clock" />
                    <span className="total-time-label">Total time:</span>
                    <span className="total-time-value">
                        {recipe.totalTime} min
                    </span>
                </div>
                <div className="recipe-card-actions btn-row">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/recipe/edit/${recipe.id}`)
                        }}
                        className="recipe-card-btn edit btn-flex"
                    >
                        <img src={editIcon} alt="edit" className="icon-btn" />
                    </button>
                    <button
                        className="recipe-card-btn delete btn-flex"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(recipe.id)
                        }}
                    >
                        <img
                            src={deleteIcon}
                            alt="delete"
                            className="icon-btn"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}
