import { useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

/* ========== Styled ========== */
const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

const Viewport = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: ${({ $padRight }) => $padRight}px;
  padding-left: ${({ $padLeft }) => $padLeft}px;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Track = styled.div`
  position: absolute;
  right: ${({ $offset }) => $offset}px;
  top: ${({ $top }) => $top}px;
  bottom: ${({ $bottom }) => $bottom}px;
  width: ${({ $width }) => $width}px;
   background: rgba(0, 0, 0, 0.004);
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    box-shadow: inset 1.55061px 1.55061px 1.55061px rgba(0, 40, 130, 0.3);
    border-radius: 16.7466px;
  z-index: 4;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
`;

const Thumb = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: var(--color-accent);
    background: ${({$isSimple}) => $isSimple ? 'var(--color-accent)' : 'linear-gradient(165.33deg, rgba(173, 207, 245, 0.8) 10.37%, rgba(95, 131, 255, 0.8) 37.88%, rgba(0, 76, 218, 0.8) 76.25%)'};
    border: 0.5px solid rgba(0, 76, 218, 0.5);
    border-radius: 16px;
    min-height: ${({ $minHeight }) => $minHeight}px;
    transition: background 0.15s ease, width 0.15s ease, left 0.15s ease;
`;

/* ========== Component ========== */
export function Scrollbar({
    children,
    className,
    style,
    position = 'right',      // 'right' | 'left'
    offset = 8,              // отступ от края контейнера (px)
    top = 8,                 // отступ трека сверху (px)
    bottom = 8,              // отступ трека снизу (px)
    width = 6,               // ширина трека (px)
    minThumbHeight = 40, 
    isSimple,   
}) {
    const viewportRef = useRef(null);
    const trackRef = useRef(null);
    const thumbRef = useRef(null);

    const [hasScroll, setHasScroll] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const state = useRef({
        dragging: false,
        startY: 0,
        startScroll: 0,
        trackHeight: 0,
        thumbHeight: 0,
    }).current;

    // Отступ контента под скроллбар
    const padValue = hasScroll ? offset + width + 4 : 0;

    const updateThumb = useCallback(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!viewport || !track || !thumb) return;

        const scrollable = viewport.scrollHeight - viewport.clientHeight > 5;
        setHasScroll(scrollable);

        if (!scrollable) return;

        const ratio = viewport.clientHeight / viewport.scrollHeight;
        const trackHeight = track.clientHeight; // ← берём реальную высоту трека с учётом top/bottom
        const thumbHeight = Math.max(ratio * trackHeight, minThumbHeight);
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const scrollRatio = maxScroll > 0 ? viewport.scrollTop / maxScroll : 0;
        const thumbTop = scrollRatio * (trackHeight - thumbHeight);

        state.trackHeight = trackHeight;
        state.thumbHeight = thumbHeight;

        thumb.style.height = `${thumbHeight}px`;
        thumb.style.transform = `translateY(${thumbTop}px)`;
    }, [state, minThumbHeight]);

    useEffect(() => {
        const viewport = viewportRef.current;
        const thumb = thumbRef.current;
        const track = trackRef.current;
        if (!viewport || !thumb || !track) return;

        // --- Обновление ползунка ---
        viewport.addEventListener('scroll', updateThumb, { passive: true });
        const ro = new ResizeObserver(updateThumb);
        ro.observe(viewport);
        if (viewport.firstElementChild) {
            ro.observe(viewport.firstElementChild);
        }
        updateThumb();

        // --- Touch drag ---
        const onTouchStart = (e) => {
            state.dragging = true;
            state.startY = e.touches[0].clientY;
            state.startScroll = viewport.scrollTop;
            setIsDragging(true);
        };

        const onTouchMove = (e) => {
            if (!state.dragging) return;
            const deltaY = e.touches[0].clientY - state.startY;
            const maxScroll = viewport.scrollHeight - viewport.clientHeight;
            const trackH = state.trackHeight - state.thumbHeight;
            if (trackH <= 0) return;
            viewport.scrollTop = state.startScroll + (deltaY / trackH) * maxScroll;
        };

        const onTouchEnd = () => {
            if (!state.dragging) return;
            state.dragging = false;
            setIsDragging(false);
        };

        // --- Click по треку (перепрыгнуть) ---
        const onTrackClick = (e) => {
            if (e.target === thumb) return;
            const rect = track.getBoundingClientRect();
            const clickRatio = (e.clientY - rect.top) / rect.height;
            viewport.scrollTop = clickRatio * (viewport.scrollHeight - viewport.clientHeight);
        };

        thumb.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd);

        track.addEventListener('click', onTrackClick);

        return () => {
            viewport.removeEventListener('scroll', updateThumb);
            ro.disconnect();
            thumb.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            track.removeEventListener('click', onTrackClick);
        };
    }, [updateThumb, state]);

    return (
        <Container className={className} style={style}>
            <Viewport
                ref={viewportRef}
                $padRight={position === 'right' ? padValue : 0}
                $padLeft={position === 'left' ? padValue : 0}
            >
                {children}
            </Viewport>
            <Track
                ref={trackRef}
                $visible={hasScroll}
                $position={position}
                $offset={offset}
                $top={top}
                $bottom={bottom}
                $width={width}
            >
                <Thumb
                    ref={thumbRef}
                    $isSimple={isSimple}
                    $dragging={isDragging}
                    $minHeight={minThumbHeight}
                />
            </Track>
        </Container>
    );
}