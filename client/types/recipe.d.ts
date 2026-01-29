// Types for recipe editing
export interface RecipeDetailsProps {
    user_id: number
    title: string
    imageUrl?: string
    totalTime: number
    ingredients: string[]
    instructions: string[]
    id: number
}

export interface RecipeEditPayload {
    title: string
    image_url?: string
    total_time: number
    ingredients: { name: string }[]
    instructions: { step_text: string; step_number: number }[]
}

export interface RecipeCreatePayload {
    title: string
    image_url?: string
    total_time: number
    ingredients: { name: string }[]
    instructions: { step_text: string; step_number: number }[]
}

export type RecipeCardProps = {
    recipe: Recipe
    onDelete: (id: number) => void
}

export type Recipe = {
    id: number
    title: string
    totalTime: number
    imageUrl?: string | null
}

export interface AIRecipe {
    name: string
    ingredients: string[]
    instructions: string[]
    total_time: number
}
