import { useCallback, useState } from 'react'

// thanks to https://github.com/WICG/serial/blob/gh-pages/EXPLAINER.md
//         & https://codelabs.developers.google.com/codelabs/web-serial/

// TODO: refactor this into something better
export const useSerial = () => {
  const [port, setPort] = useState()
  const [reader, setReader] = useState()
  const [inputDone, setInputDone] = useState()
  const [outputStream, setOutputStream] = useState()
  const [outputDone, setOutputDone] = useState()

  const readFromSerial = useCallback(async () => {
    while (reader) {
      const { value, done } = await reader.read()
      if (value) {
        console.log('[OSR][READ] ' + value)
      }
      if (done) {
        console.log('[OSR][INFO] READ LOOP CLOSED')
        reader.releaseLock()
        break
      }
    }
  }, [reader])

  const disconnect = useCallback(async () => {
    if (port) {
      if (reader) {
        await reader.cancel()
        await inputDone.catch(() => {})
        setReader(null)
        setInputDone(null)
      }
      if (outputStream) {
        await outputStream.getWriter().close()
        await outputDone
        setOutputStream(null)
        setOutputDone(null)
      }
      await port.close()
      setPort(null)
    }
  }, [port, reader, outputStream, inputDone, outputDone])

  const connect = useCallback(async () => {
    if (!port) {
      try {
        const newPort = await navigator.serial.requestPort()
        await newPort.open({ baudRate: 115200 })
        setPort(newPort)

        // eslint-disable-next-line no-undef
        const encoder = new TextEncoderStream()
        setOutputDone(encoder.readable.pipeTo(newPort.writable))
        setOutputStream(encoder.writable)

        // eslint-disable-next-line no-undef
        const decoder = new TextDecoderStream()
        setInputDone(newPort.readable.pipeTo(decoder.writable))
        setReader(decoder.readable.getReader())

        readFromSerial()
      } catch (e) {
        setPort(null)
        setOutputDone(null)
        setOutputStream(null)
        setInputDone(null)
        setReader(null)
        throw e
      }
    } else {
      console.warn('[OSR][WARN] Port already set')
    }
  }, [port, readFromSerial])

  const writeToSerial = async (...lines) => {
    if (outputStream) {
      const writer = outputStream.getWriter()
      lines.forEach(line => {
        console.log('[OSR][SEND]', line, '\n')
        writer.write(line + '\n')
      })
      writer.releaseLock()
    } else {
      console.warn('[OSR][WARN] Disconnected, skipping stream write')
    }
  }

  return [connect, disconnect, writeToSerial]
}
