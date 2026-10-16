import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'

import { quizzes } from '../../api/quizzes'
import Card from '../Card/Card'
import Loader from '../Loader/Loader'
import styles from './SearchModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const [query, setQuery] = useState('')
  const isLoading = false // TODO: true, пока идёт запрос к API

  // TODO:искать на бэкенде
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results = quizzes.filter((quiz) => words.every((word) => quiz.title.toLowerCase().includes(word)))

  
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.autofocus = window.matchMedia('(pointer: coarse)').matches
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])


  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

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
          <input
            type="search"
            className={styles.input}
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <button type="button" className={styles.close} aria-label="Close search" onClick={onClose}>
          <span className={`${styles.icon} ${styles.closeIcon}`} />
        </button>
      </div>


      <div className={styles.panel} data-lenis-prevent>
        {isLoading ? (
          <Loader />
        ) : results.length > 0 ? (
          <div className={styles.results}>
            {results.map((quiz) => (
              <Card key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyFace}>:(</p>
            <p className={styles.emptyTitle}>Nothing found</p>
            <p>Try a different keyword or check the spelling</p>
          </div>
        )}
      </div>
    </dialog>
  )
}
