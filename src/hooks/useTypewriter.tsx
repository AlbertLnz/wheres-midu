import { useState, useEffect } from 'preact/hooks'

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, speed)

    return () => {
      clearInterval(typingInterval)
    }
  }, [text, speed])

  return displayText
}

const Typewriter = ({ text, speed }: { text: string; speed: number }) => {
  const displayText = useTypewriter(text, speed)

  return <span className='text-6xl'>{displayText}</span>
}

export default Typewriter
