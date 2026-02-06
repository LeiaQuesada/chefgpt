import { useState, useRef, useEffect } from 'react'
import type { RecipeUploadImageProps } from '../../types/recipe'
import { uploadPhoto } from './recipe-upload-image-api.ts'
import styles from './RecipeUploadImage.module.css'

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

    // Clean up obj URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    async function handleSubmit(formData: FormData) {
        setError('')
        setUpdating(true)
        const file = formData.get('photo')
        if (!file || !(file instanceof File) || file.size === 0) {
            setError('Select a file by dragging, dropping, or clicking the box')
            setUpdating(false)
            return
        }
        if (
            !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
                file.type
            )
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
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: url }),
                credentials: 'include',
            })
            if (!response.ok) {
                const data = await response.json()
                setError(data.detail || 'Failed to update recipe image')
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to update recipe image')
        } finally {
            setUpdating(false)
            setPreview(null)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            if (
                ![
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                ].includes(file.type)
            ) {
                setError('Unsupported Image Type')
                setPreview(null)
                return
            }
            setError('')
            if (preview) URL.revokeObjectURL(preview)
            setPreview(URL.createObjectURL(file))
        }
    }

    // Drag handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
        else if (e.type === 'dragleave') setDragActive(false)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            if (
                ![
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                ].includes(file.type)
            ) {
                setError('Unsupported Image Type')
                setPreview(null)
                return
            }
            setError('')
            //  Clean up the previous preview URL to prevent memory leaks
            if (preview) URL.revokeObjectURL(preview)
            setPreview(URL.createObjectURL(file))
            // Set file in input for form
            if (fileInputRef.current) {
                const dt = new DataTransfer()
                dt.items.add(file)
                fileInputRef.current.files = dt.files
            }
        }
    }

    return (
        <form className={styles.uploadContainer} action={handleSubmit}>
            <div className={styles.uploadMain}>
                <label
                    className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className={styles.previewWrapper}>
                        {preview ? (
                            <>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className={styles.previewImg}
                                />

                                <div className={styles.overlayText}>
                                    Click to change image.
                                </div>
                            </>
                        ) : (
                            <div className={styles.uploadPrompt}>
                                <span className={styles.uploadIcon}>📸</span>
                                <p>Drag & drop or click to upload.</p>
                                <span className={styles.subtext}>
                                    JPEG, PNG, WebP
                                </span>
                            </div>
                        )}
                    </div>

                    <input
                        className={styles.visuallyHidden}
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={updating}
                    />
                </label>
                <button
                    className={styles.btnPrimary}
                    type="submit"
                    disabled={updating}
                >
                    {updating ? 'Uploading...' : 'Update Image'}
                </button>{' '}
            </div>
            {error && <p className={styles.errorMsg}>⚠️ {error}</p>}
        </form>
    )
}
