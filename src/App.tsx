import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import UiVirtualScroll from './components/UiVirtualScroll'

const callApi = (offset: number, limit: number) => {
  return new Promise((resolve) => {
    const items = [] as any
    for (let index = offset; index < offset + limit; index++) {
      items.push('label ' + index)
    }

    setTimeout(() => {
      resolve(items)
    }, 2000)
  })
}

function App() {
  const myRef: any = useRef<any>(null)
  const limit = 100
  const [upperOffset, setUpperOffset] = useState(0)
  const [lowerOffset, setLowerOffset] = useState(299)
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentScrollTop, setCurrentScrollTop] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    callApi(upperOffset, 300).then((res: any) => {
      setRows(res)
      setIsLoading(false)
    })
  }, [])

  const handleScroll = (target: any, e: any) => {
    const scrollTop = Math.round(target.scrollTop)
    const clientHeight = Math.round(target.clientHeight)
    const scrollHeight = Math.round(target.scrollHeight)
    const rowHeight = Math.round(scrollHeight / rows.length)

    if (isLoading) {
      return
    }

    const isUp = scrollTop < currentScrollTop

    if (isUp && scrollTop === 0) {
      setIsLoading(true)

      callApi(upperOffset - limit, limit).then((res: any) => {
        const newRows = [...res, ...rows.slice(0, 200)] as any
        setRows(newRows)
        setIsLoading(false)
        setUpperOffset(upperOffset - limit)
        setLowerOffset(lowerOffset - limit)

        if (myRef !== null) {
          const scrollPos = (rows.length / 3) * rowHeight
          myRef.current.scrollTo(0, scrollPos)
        }
      })
    } else if (!isUp && scrollTop + clientHeight >= scrollHeight) {
      console.log('next')
      setIsLoading(true)
      callApi(lowerOffset, limit).then((res: any) => {
        const newRows = [...rows.slice(99, 299), ...res] as any

        setRows(newRows)
        setIsLoading(false)
        setUpperOffset(upperOffset + limit)
        setLowerOffset(lowerOffset + limit)

        if (myRef !== null) {
          const scrollPos = (rows.length / 3) * rowHeight
          myRef.current.scrollTo(0, scrollPos * 2)
        }
      })
    }

    setCurrentScrollTop(scrollTop)
  }

  const prevCallback = (newOffset: number) => {
    setIsLoading(true)

    return callApi(newOffset, limit).then((res: any) => {
      const newRows = [...res, ...rows.slice(0, 200)] as any
      setRows(newRows)
      setIsLoading(false)
      return true
    })
  }

  const nextCallback = (newOffset: number) => {
    setIsLoading(true)

    return callApi(newOffset, limit).then((res: any) => {
      const newRows = [...rows.slice(99, 299), ...res] as any

      setRows(newRows)
      setIsLoading(false)
      return true
    })
  }

  const [isDataLoading, setIsDataLoading] = useState(false)

  return (
    <div className="App">
      {/* <div
        className="virtual-scroll"
        style={{ height: '50vh', overflow: 'scroll' }}
        ref={myRef}
        onScroll={(e: any) => handleScroll(e.target, e)}
      >
        {rows.map((item: any, index: number) => (
          <div style={{ padding: '10px' }}>
            {isLoading ? <>Loading...</> : item}
          </div>
        ))}
      </div> */}

      {/* rowHeight: number
 
 
  onPrevCallback: (newOffset: number) => void
  onNextCallback: (newOffset: number) => void */}

      <UiVirtualScroll
        buffer={300}
        rowHeight={39}
        height={50}
        limit={100}
        onPrevCallback={prevCallback}
        onNextCallback={nextCallback}
      >
        <>
          {rows.map((item: any, index: number) => (
            <div style={{ padding: '10px' }}>
              {isLoading ? <>Loading...</> : item}
            </div>
          ))}
        </>
      </UiVirtualScroll>
    </div>
  )
}

export default App
