import { useState, useRef, useEffect } from 'react'
import type { RecipeUploadImageProps } from '../../types/recipe'
import { uploadPhoto } from './recipe-upload-image-api.ts'

export default function RecipeUploadImage({
    recipeId,
    onImageUrlChange,
}: RecipeUploadImageProps) {
    const [error, setError] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [updating, setUpdating] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Clean up object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    async function handleSubmit(formData: FormData) {
        setError('')
        setUpdating(true)
        const file = formData.get('photo')
        if (file instanceof File) {
            if (
                file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/gif' &&
                file.type !== 'image/webp'
            ) {
                setError('Unsupported Image Type')
                setUpdating(false)
                return
            }
            const url = await uploadPhoto(formData)
            if (url instanceof Error) {
                setError(url.message)
                setUpdating(false)
                return
            }
            setImageURL(url)
            if (onImageUrlChange) onImageUrlChange(url)
            // Update the recipe's image_url in the backend
            try {
                const response = await fetch(`/api/recipes/${recipeId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image_url: url }),
                    credentials: 'include',
                })
                if (!response.ok) {
                    let msg = 'Failed to update recipe image'
                    const data = await response.json()
                    msg = data.detail || msg
                    setError(msg)
                }
            } catch (err) {
                setError(
                    (err as Error).message || 'Failed to update recipe image'
                )
            } finally {
                setUpdating(false)
            }
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            if (
                file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/gif' &&
                file.type !== 'image/webp'
            ) {
                setError('Unsupported Image Type')
                setPreview(null)
                return
            }
            setError('')
            // Clean up the previous preview URL to prevent memory leaks
            if (preview) {
                URL.revokeObjectURL(preview)
            }
            setPreview(URL.createObjectURL(file))
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            if (
                file.type !== 'image/jpeg' &&
                file.type !== 'image/png' &&
                file.type !== 'image/gif' &&
                file.type !== 'image/webp'
            ) {
                setError('Unsupported Image Type')
                setPreview(null)
                return
            }
            setError('')
            // Clean up the previous preview URL to prevent memory leaks
            if (preview) {
                URL.revokeObjectURL(preview)
            }
            setPreview(URL.createObjectURL(file))
            // Set file in input for form submission
            if (fileInputRef.current) {
                const dt = new DataTransfer()
                dt.items.add(file)
                fileInputRef.current.files = dt.files
            }
        }
    }

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDragActive(true)
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setDragActive(false)
    }

    return (
        <>
            <form
                className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 grid grid-rows-2 gap-6 max-w-md"
                action={handleSubmit}
            >
                {imageURL && (
                    <div className="mb-4">
                        <p className="text-green-600 font-medium mb-2">
                            ✅ Image uploaded successfully!
                        </p>
                    </div>
                )}
                {error ? (
                    <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
                        ⚠️ {error}
                    </p>
                ) : (
                    ''
                )}
                <div
                    className={`p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer text-center ${
                        dragActive
                            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                >
                    <p
                        className={`font-medium mb-2 transition-colors duration-200 ${
                            dragActive ? 'text-blue-700' : 'text-slate-700'
                        }`}
                    >
                        {dragActive
                            ? '🎯 Drop it here!'
                            : '📁 Drag & drop an image here, or click to select'}
                    </p>
                    <p className="text-sm text-slate-500">
                        Supports: JPEG, PNG, GIF, WebP
                    </p>
                    <input
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        name="photo"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        onClick={(e) => e.stopPropagation()} // Prevents double opening
                        disabled={updating}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-4 mx-auto rounded-lg shadow-md border-2 border-green-200"
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                </div>
                <button
                    className="rg-generate-btn"
                    type="submit"
                    disabled={updating}
                >
                    {updating ? 'Uploading...' : 'Save Image'}
                </button>
            </form>
        </>
    )
}
