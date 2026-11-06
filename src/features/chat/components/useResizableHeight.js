import { useRef, useState } from 'react'

const INCREASE_KEY = 'ArrowUp'
const DECREASE_KEY = 'ArrowDown'

export function useResizableHeight({
  initialHeight,
  minHeight,
  topOffset,
  step,
}) {
  const [height, setHeight] = useState(initialHeight)
  const [maxHeight, setMaxHeight] = useState()
  const containerRef = useRef(null)
  const dragStartRef = useRef(null)

  const getRect = () => containerRef.current.getBoundingClientRect()
  // 패널 아래쪽은 고정이므로 위로 늘어난다. 윗변이 topOffset에 닿는 높이까지만 허용한다.
  const getMaxHeight = () => getRect().bottom - topOffset
  const clamp = (value) => Math.max(minHeight, Math.min(value, getMaxHeight()))

  const handleProps = {
    'aria-valuemin': minHeight,
    'aria-valuemax': maxHeight,
    'aria-valuenow': Math.round(Math.min(height, maxHeight ?? height)),
    onFocus: () => setMaxHeight(getMaxHeight()),
    onPointerDown: (event) => {
      if (event.button !== 0) return
      // 캡처하면 포인터가 손잡이 밖으로 나가도 드래그가 끊기지 않고, 놓을 때 자동으로 해제된다.
      event.currentTarget.setPointerCapture(event.pointerId)
      dragStartRef.current = {
        pointerY: event.clientY,
        height: getRect().height,
      }
    },
    onPointerMove: (event) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
      const { pointerY, height: startHeight } = dragStartRef.current
      setHeight(clamp(startHeight + pointerY - event.clientY))
    },
    onKeyDown: (event) => {
      if (event.key !== INCREASE_KEY && event.key !== DECREASE_KEY) return
      event.preventDefault()
      const change = event.key === INCREASE_KEY ? step : -step
      setHeight(clamp(getRect().height + change))
    },
  }

  return { height, containerRef, handleProps }
}
