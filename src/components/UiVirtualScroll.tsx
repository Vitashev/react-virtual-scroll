import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

interface UiVirtualScrollProps {
  offset?: number
  rowHeight: number
  buffer: number
  height: string
  limit: number
  children: JSX.Element
  onPrevCallback: (newOffset: number) => Promise<boolean>
  onNextCallback: (newOffset: number) => Promise<boolean>
}

const UiVirtualScroll: FunctionComponent<UiVirtualScrollProps> = ({
  offset = 0,
  buffer = 300,
  limit = 100,
  rowHeight = 19,
  height,
  onPrevCallback,
  onNextCallback,
  children,
}) => {
  const overlayRef: any = useRef<any>(null)

  const [upperBoundary, setUpperBoundary] = useState(offset)
  const [lowerBoundary, setLowerBoundary] = useState(buffer - 1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentScrollTopPosition, setCurrentScrollTopPosition] = useState(0)

  const handleScroll = (target: any) => {
    if (isLoading) {
      return
    }
    const scrollTop = Math.round(target.scrollTop)
    const clientHeight = Math.round(target.clientHeight)
    const scrollHeight = Math.round(target.scrollHeight)

    const isUp = scrollTop < currentScrollTopPosition

    if (isUp && scrollTop === 0) {
      setIsLoading(true)

      onPrevCallback(upperBoundary - limit).then(() => {
        setUpperBoundary(upperBoundary - limit)
        setLowerBoundary(lowerBoundary - limit)

        if (overlayRef !== null) {
          const scrollPos = (buffer / 3) * rowHeight
          overlayRef.current.scrollTo(0, scrollPos)
        }
        setIsLoading(false)
      })
    } else if (!isUp && scrollTop + clientHeight >= scrollHeight) {
      setIsLoading(true)
      onNextCallback(lowerBoundary).then(() => {
        setUpperBoundary(upperBoundary + limit)
        setLowerBoundary(lowerBoundary + limit)

        if (overlayRef !== null) {
          const scrollPos = (buffer / 3) * rowHeight
          overlayRef.current.scrollTo(0, scrollPos * 2)
        }
        setIsLoading(false)
      })
    }

    setCurrentScrollTopPosition(scrollTop)
  }

  return (
    <div
      ref={overlayRef}
      style={{ height, overflow: 'scroll' }}
      onScroll={(e: any) => handleScroll(e.target)}
    >
      {children}
    </div>
  )
}

export default UiVirtualScroll
