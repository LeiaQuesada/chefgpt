import { useNavigate } from 'react-router-dom'
// Data model
  async function handleDeleteButton(id: number) {
    try {
      const response = await fetch(`http://localhost:8000/recipes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const newRecipeList = recipes.filter(
        (recipe_item) => recipe_item.id !== id,
      );
      setRecipes(newRecipeList);
     t
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
    }
  }
const RecipeCard = () => {
    const navigate = useNavigate()
}
return (
    <div className="recipe-card">
        <div className="recipe-card-left">
            <div>
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-time">
                    Total time: {recipe.totalTime} min
                </div>
            </div>

            <div className="recipe-card-actions">
                <button
                    type="button"
                    aria-label={`View recipe ${recipe.title}`}
                    className="recipe-card-btn view"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // stop click from navigating to detail page
                      handleDeleteButton(restaurant.id);
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
)

export default RecipeCard
