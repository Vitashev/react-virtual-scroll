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
  const limit = 100
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    callApi(0, 300).then((res: any) => {
      setRows(res)
      setIsLoading(false)
    })
  }, [])

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

  return (
    <div className="App">
      <UiVirtualScroll
        buffer={300}
        rowHeight={39}
        height="50vh"
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
