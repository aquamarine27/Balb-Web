import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { quizzes } from '../../api/quizzes'
import Card from '../../components/Card/Card'
import Hero from '../../components/Hero/Hero'
import styles from './Home.module.css'

const categories = [...new Set(quizzes.map((quiz) => quiz.category))]

// TODO: подборка для слайдера с бэкенда
const featured = quizzes.slice(0, 3)

export default function Home() {
  const [category, setCategory] = useState<string | null>(null)
  const visible = category ? quizzes.filter((quiz) => quiz.category === category) : quizzes

  return (
    <div className={styles.home}>
      <Hero quizzes={featured} />

      <div className={styles.filters} role="group" aria-label="Filter by category">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={styles.filter}
            aria-pressed={name === category}
            onClick={() => setCategory(name === category ? null : name)}
          >
            {name}
          </button>
        ))}
      </div>

      <MotionConfig reducedMotion="user">
        <div className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {visible.map((quiz, i) => (
              <motion.div
                key={quiz.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: Math.min(i, 8) * 0.05,
                  layout: { type: 'spring', visualDuration: 0.7, bounce: 0 },
                }}
              >
                <Card quiz={quiz} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </div>
  )
}
