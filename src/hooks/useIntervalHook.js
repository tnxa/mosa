import { useEffect, useRef } from 'react'

// thanks https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback]) // depend on callback (rerun when callback changes)

  // set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id) // clean up afterwards
    }
  }, [delay]) // depend on delay (rerun when delay changes)
}
