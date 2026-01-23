import React from "react";

// Data model
export type RecipeSummary = {
    id: number;
    title: string;
    totalTime: number; // minutes
    imageUrl?: string | null;
};

type RecipeCardProps = {
    recipe: RecipeSummary;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onView, onEdit, onDelete }) => {
    return (
        <div className="recipe-card">
            <div className="recipe-card-left">
                <div>
                    <div className="recipe-card-title">{recipe.title}</div>
                    <div className="recipe-card-time">Total time: {recipe.totalTime} min</div>
                </div>

                <div className="recipe-card-actions">
                    <button
                        type="button"
                        aria-label={`View recipe ${recipe.title}`}
                        className="recipe-card-btn view"
                        onClick={() => onView(recipe.id)}
                    >
                        View
                    </button>

                    <button
                        type="button"
                        aria-label={`Edit recipe ${recipe.title}`}
                        className="recipe-card-btn edit"
                        onClick={() => onEdit(recipe.id)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        aria-label={`Delete recipe ${recipe.title}`}
                        className="recipe-card-btn delete"
                        onClick={() => onDelete(recipe.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="recipe-card-image-box">
                {recipe.imageUrl ? (
                    <img
                        src={recipe.imageUrl}
                        alt={`${recipe.title} recipe image`}
                        className="recipe-card-image"
                    />
                ) : (
                    <span className="recipe-card-image-placeholder">image</span>
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
