'use client'

import { useState, useEffect } from 'react'

const WORDS = ['creators', 'influencers', 'trusted people']

export default function HeroHeadline() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = WORDS[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed === current) {
      // Fully typed — pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayed === '') {
      // Fully deleted — next word
      setIsDeleting(false)
      setWordIndex((i) => (i + 1) % WORDS.length)
    } else if (!isDeleting) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 95)
    } else {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 55)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIndex])

  return (
    <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
      Shop what your favourite
      <br />
      <span className="text-violet-600">{displayed}</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block w-[3px] align-middle bg-violet-600 animate-[cursor-blink_1s_ease-in-out_infinite]"
        style={{ height: '0.85em' }}
      />
      {' '}love
    </h1>
  )
}
