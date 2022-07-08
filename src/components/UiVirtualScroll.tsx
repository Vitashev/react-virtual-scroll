import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

interface UiVirtualScrollProps {
  //   isLoading?: boolean
  offset?: number
  rowHeight: number
  buffer: number
  height: number
  limit: number
  children: JSX.Element
  //   onLoadingCallback: (loading: boolean) => void
  onPrevCallback: (newOffset: number) => Promise<boolean>
  onNextCallback: (newOffset: number) => Promise<boolean>
}

// const callApi = (offset: number, limit: number) => {
//   return new Promise((resolve) => {
//     const items = [] as any
//     for (let index = offset; index < offset + limit; index++) {
//       items.push('label ' + index)
//     }

//     setTimeout(() => {
//       resolve(items)
//     }, 2000)
//   })
// }

const UiVirtualScroll: FunctionComponent<UiVirtualScrollProps> = ({
  offset = 0,
  buffer = 300,
  limit = 100,
  rowHeight = 19,
  //   isLoading = false,
  onPrevCallback,
  onNextCallback,
  //   onLoadingCallback,
  children,
}) => {
  const myRef: any = useRef<any>(null)

  const [upperOffset, setUpperOffset] = useState(offset)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [lowerOffset, setLowerOffset] = useState(buffer - 1)
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentScrollTop, setCurrentScrollTop] = useState(0)

  //   useEffect(() => {
  //     if (!isLoading && myRef !== null) {
  //       myRef.current.scrollTo(0, scrollPosition)
  //     }
  //   }, [isLoading, scrollPosition])

  const handleScroll = (target: any, e: any) => {
    if (isLoading) {
      return
    }
    const scrollTop = Math.round(target.scrollTop)
    const clientHeight = Math.round(target.clientHeight)
    const scrollHeight = Math.round(target.scrollHeight)
    // const rowHeight = Math.round(scrollHeight / rows.length)
    console.log(scrollTop, clientHeight, scrollHeight)
    const isUp = scrollTop < currentScrollTop

    if (isUp && scrollTop === 0) {
      setIsLoading(true)

      //   onPrevCallback(upperOffset - limit)

      //   setUpperOffset(upperOffset - limit)
      //   setLowerOffset(lowerOffset - limit)

      //   if (myRef !== null) {
      //     const scrollPos = (rows.length / 3) * rowHeight
      //     // myRef.current.scrollTo(0, scrollPos)
      //     // setScrollPosition(scrollPos)
      //     // setTimeout(() => {
      //     //   myRef.current.scrollTo(0, scrollPos)
      //     // }, 3000)

      //     //   myRef.current.scrollTo(0, scrollPos)
      //   }

      onPrevCallback(upperOffset - limit).then(() => {
        setUpperOffset(upperOffset - limit)
        setLowerOffset(lowerOffset - limit)

        if (myRef !== null) {
          const scrollPos = (buffer / 3) * rowHeight
          //   setScrollPosition(scrollPos)
          myRef.current.scrollTo(0, scrollPos)
        }
        setIsLoading(false)
      })
    } else if (!isUp && scrollTop + clientHeight >= scrollHeight) {
      console.log('next')

      //   onNextCallback(lowerOffset)
      //   // setIsLoading(false)
      //   setUpperOffset(upperOffset + limit)
      //   setLowerOffset(lowerOffset + limit)

      //   if (myRef !== null) {
      //     const scrollPos = (rows.length / 3) * rowHeight * 2
      //     // setScrollPosition(scrollPos)
      //     // setTimeout(() => {
      //     //   myRef.current.scrollTo(0, scrollPos)
      //     // }, 3000)

      //     // setScrollPosition(scrollPos)
      //     //   myRef.current.scrollTo(0, scrollPos * 2)
      //   }
      setIsLoading(true)
      onNextCallback(lowerOffset).then(() => {
        setUpperOffset(upperOffset + limit)
        setLowerOffset(lowerOffset + limit)

        if (myRef !== null) {
          const scrollPos = (buffer / 3) * rowHeight

          myRef.current.scrollTo(0, scrollPos * 2)
        }
        setIsLoading(false)
      })
    }

    setCurrentScrollTop(scrollTop)
  }

  return (
    <div
      ref={myRef}
      className="virtual-scroll"
      style={{ height: '50vh', overflow: 'scroll' }}
      onScroll={(e: any) => handleScroll(e.target, e)}
    >
      {children}
    </div>
  )
}

export default UiVirtualScroll
