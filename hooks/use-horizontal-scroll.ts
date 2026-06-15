import { useRef, useState, useEffect, useCallback } from 'react'

type UseHorizontalScrollReturn = {
  scrollRef: React.RefObject<HTMLDivElement | null>
  canScrollLeft: boolean
  canScrollRight: boolean
  scrollBy: (direction: 'left' | 'right') => void
  onScroll: () => void
}

export function useHorizontalScroll(scrollAmount = 300): UseHorizontalScrollReturn {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('resize', onScroll)
    return () => window.removeEventListener('resize', onScroll)
  }, [onScroll])

  const scrollBy = useCallback(
    (direction: 'left' | 'right') => {
      scrollRef.current?.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    },
    [scrollAmount]
  )

  return { scrollRef, canScrollLeft, canScrollRight, scrollBy, onScroll }
}
