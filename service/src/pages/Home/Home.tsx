import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <section id="center">
      <button
        type="button"
        className="counter"
        onFocus={() => {setCount(count+1)}}
      >
        Count is {count}
      </button>
    </section>
  )
}
