import React, { useState } from 'react';
import RecipeCard from './recipeCard';
import '../App.css'

// Data model
type RecipeSummary = {
    id: number;
    title: string;
    totalTime: number;
    imageUrl?: string | null;
};

const initialRecipes: RecipeSummary[] = [
    {
        id: 1,
        title: 'Classic Lasagna',
        totalTime: 90,
        imageUrl: null,
    },
    {
        id: 2,
        title: 'Lemon Herb Chicken',
        totalTime: 45,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    },
    {
        id: 3,
        title: 'Vegetarian Chili',
        totalTime: 60,
        imageUrl: null,
    },
    {
        id: 4,
        title: 'Chocolate Chip Cookies',
        totalTime: 30,
        imageUrl: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c',
    },
];

const Cookbook: React.FC = () => {
    const [recipes, setRecipes] = useState<RecipeSummary[]>(initialRecipes);

    const handleView = (id: number) => {
        console.log('view', id);
    };

    const handleEdit = (id: number) => {
        console.log('edit', id);
    };

    const handleDelete = (id: number) => {
        setRecipes(recipes => recipes.filter(r => r.id !== id));
    };

    return (
        <div className="cookbook-container">
            <h1 className="cookbook-title">My Cookbook</h1>
            <div className="cookbook-list">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default Cookbook;
