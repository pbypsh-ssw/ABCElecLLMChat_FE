import { useEffect, useRef } from 'react'

export function useScrollToEnd(dependency) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [dependency])

  return containerRef
}
