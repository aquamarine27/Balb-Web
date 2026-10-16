import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { quizzes } from '../../api/quizzes'
import Card from '../Card/Card'
import Loader from '../Loader/Loader'
import styles from './SearchModal.module.css'

// слова для плейсхолдера
const PLACEHOLDER_WORDS = ['quizzes', 'politics', 'personality', 'love', 'tastes', 'spicy']
const WORD_DURATION = 3200

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const [query, setQuery] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const isLoading = false // TODO: true, пока идёт запрос к API

  const deferredQuery = useDeferredValue(query)

  // TODO:искать на бэкенде
  const words = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean)
  const results = quizzes.filter((quiz) => words.every((word) => quiz.title.toLowerCase().includes(word)))

  
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery(``)
      dialog.autofocus = window.matchMedia('(pointer: coarse)').matches
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
    } 
  }, [open])


  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])


  useEffect(() => {
    if (!open || query) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => setWordIndex((i) => (i + 1) % PLACEHOLDER_WORDS.length), WORD_DURATION)
    return () => clearInterval(id)
  }, [open, query])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={onClose}
      onCancel={(e) => e.preventDefault()}
    >
      <div className={styles.searchRow}>
        <label className={styles.field}>
          <span className={`${styles.icon} ${styles.searchIcon}`} />
          <span className={styles.inputWrap}>
            <input
              type="search"
              className={styles.input}
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {!query && (
              <span className={styles.placeholder} aria-hidden="true">
                Search
                <span
                  key={wordIndex}
                  className={styles.placeholderWord}
                  style={{ animationDuration: `${WORD_DURATION}ms` }}
                >
                  {PLACEHOLDER_WORDS[wordIndex]}
                </span>
              </span>
            )}
          </span>
        </label>

        <button type="button" className={styles.close} aria-label="Close search" onClick={onClose}>
          <span className={`${styles.icon} ${styles.closeIcon}`} />
        </button>
      </div>


      <motion.div className={styles.panel} data-lenis-prevent layoutScroll>
        {isLoading ? (
          <Loader />
        ) : results.length > 0 ? (
          <MotionConfig reducedMotion="user">
            <div className={styles.results}>
              <AnimatePresence mode="popLayout">
                {results.map((quiz, i) => (
                  <motion.div
                    key={quiz.id}
                    className={styles.result}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i, 8) * 0.07,
                      layout: { type: 'spring', visualDuration: 0.7, bounce: 0 },
                    }}
                  >
                    <Card quiz={quiz} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </MotionConfig>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyFace}>:(</p>
            <p className={styles.emptyTitle}>Nothing found</p>
            <p>Try a different keyword or check the spelling</p>
          </div>
        )}
      </motion.div>
    </dialog>
  )
}
