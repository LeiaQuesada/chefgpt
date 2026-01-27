export interface RecipeDetailsProps {
    title: string
    imageUrl?: string
    totalTime: number
    ingredients: string[]
    instructions: string[]
}

export default function RecipeDetails({
    title,
    imageUrl,
    totalTime,
    ingredients,
    instructions,
}: RecipeDetailsProps) {
    return (
        <div className="recipe-details">
            <h2>{title}</h2>
            {imageUrl && (
                <img src={imageUrl} alt={title} className="recipe-image" />
            )}
            <p>
                <strong>Total Time:</strong> {totalTime} min
            </p>
            <h3>Ingredients</h3>
            <ul>
                {ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                ))}
            </ul>
            <h3>Instructions</h3>
            <ol>
                {instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                ))}
            </ol>
        </div>
    )
}
