import clockIcon from '../assets/clock.svg'

import { useNavigate } from 'react-router-dom'
import type { RecipeCardProps } from '../../types/recipe'

const imageBaseURL = 'https://placeholders.io/400/400/'
export default function CommunityRecipeCard({ recipe }: RecipeCardProps) {
    const navigate = useNavigate()
    const params = new URLSearchParams({
        style: 'photographic',
        seed: recipe.id.toString(),
    })
    const defaultRecipeURL = `${imageBaseURL}${recipe.title}?${params}`
    return (
        <div
            className="recipe-card"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        >
            <div className="recipe-card-image-box">
                <img
                    src={recipe.imageUrl || defaultRecipeURL}
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
                <div className="recipe-card-actions btn-row"></div>
            </div>
        </div>
    )
}
