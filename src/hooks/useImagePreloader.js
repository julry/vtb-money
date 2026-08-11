import {useEffect, useRef} from 'react'

function preloadImage (src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = function() {
            resolve(img)
        }
        img.onerror = img.onabort = function() {
            reject(src)
        }
        img.src = src
    })
}

export function useImagePreloader(images) {
    const preloadedRef = useRef({})

    useEffect(() => {
        for (const image of images) {
            if (!preloadedRef.current[image]) {
                preloadImage(image).then(() => preloadedRef.current[image] = true)
            }
        }
    }, [images])
}