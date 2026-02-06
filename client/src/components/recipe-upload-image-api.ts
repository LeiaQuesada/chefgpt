import type { PhotoResponse } from '../../types/recipe'

// Get API URL from environment variables, with fallback for local development
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getPhotos(): Promise<PhotoResponse[] | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/photos`)
        if (!response.ok) {
            console.log(response)
            throw new Error("Couldn't fetch images")
        }
        const photos = (await response.json()) as PhotoResponse[]
        return photos
    } catch (e) {
        if (e instanceof Error) {
            return new Error(e.message)
        } else {
            return new Error('Unknown Error')
        }
    }
}

export async function uploadPhoto(formData: FormData) {
    try {
        const response = await fetch(`${baseUrl}/api/photos`, {
            method: 'POST',
            body: formData,
        })
        if (!response.ok) {
            throw new Error('Unable to upload image')
        }
        const data = (await response.json()) as PhotoResponse
        return data.photo_url
    } catch (e) {
        if (e instanceof Error) {
            return e
        } else {
            return new Error('Unknown Error')
        }
    }
}
