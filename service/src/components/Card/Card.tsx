import type { Quiz } from '../../types'
import styles from './Card.module.css'

interface Props {
  quiz: Quiz
}

export default function Card({ quiz }: Props) {
  return (
    <article className={styles.card} data-nav="var(--nav-on-dark)">
      {quiz.imageUrl && <img className={styles.image} src={quiz.imageUrl} alt="" loading="lazy" />}

      <div className={styles.content}>
        <h3 className={styles.title}>{quiz.title}</h3>
        <span className={styles.duration}>
          <span className={styles.clockIcon} />~{quiz.duration} min
        </span>
      </div>
    </article>
  )
}
