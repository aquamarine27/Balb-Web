import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { quizzes as mockQuizzes } from '../../api/quizzes'
import Card from '../../components/Card/Card'
import Hero from '../../components/Hero/Hero'
import styles from './Home.module.css'

export default function Home() {
  // TODO: загружать с бэкенда (useState + useEffect или хук)
  const quizzes = mockQuizzes
  const [category, setCategory] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const categories = useMemo(() => [...new Set(quizzes.map((quiz) => quiz.category))], [quizzes])
  // TODO: подборка для слайдера с бэкенда
  const featured = useMemo(() => quizzes.slice(0, 3), [quizzes])
  const visible = category ? quizzes.filter((quiz) => quiz.category === category) : quizzes

  
  useEffect(() => {
    const wrap = wrapRef.current
    const grid = gridRef.current
    if (!wrap || !grid) return
    const observer = new ResizeObserver(() => {
      const next = grid.offsetHeight
      wrap.style.transitionDelay = next < wrap.offsetHeight ? '0.3s' : '0s'
      wrap.style.height = `${next}px`
    })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

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
        <div ref={wrapRef} className={styles.gridWrap}>
          <div ref={gridRef} className={styles.grid}>
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
        </div>
      </MotionConfig>
    </div>
  )
}
