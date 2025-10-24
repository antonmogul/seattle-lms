export const getSlugs = () => {
    return (window as any).__lessons as {
        courseSlug: string
        currentLessonSlug: string
    }
}