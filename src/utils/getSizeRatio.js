export function getSizeRatio(width, height, targetWidth, targetHeight) {
    const widthRatio = Math.min(width, targetWidth) / targetWidth
    const heightRatio = Math.min(height, targetHeight) / targetHeight

    return Math.min(widthRatio, heightRatio) || 1
}