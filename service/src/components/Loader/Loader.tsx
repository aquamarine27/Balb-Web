import type { CSSProperties } from 'react'

import styles from './Loader.module.css'

interface Props {
  text?: string
}

export default function Loader({ text = 'Loading, please wait' }: Props) {
  const letters = [...text]

  return (
    <div className={styles.loader} role="status" aria-label={text}>
      <div className={styles.dots}>
        <span />
        <span />
        <span />
      </div>

      {/*каждая буква это отдельный span бтв */}
      <p className={styles.text} aria-hidden="true" style={{ '--n': letters.length } as CSSProperties}>
        {letters.map((char, i) => (
          <span key={i} style={{ '--i': i } as CSSProperties}>
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </p>
    </div>
  )
}
