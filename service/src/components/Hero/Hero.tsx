import { useState, type CSSProperties } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import type { Quiz } from '../../types'
import styles from './Hero.module.css'

const AUTOPLAY = 6000
const SWIPE = 60
const EASE = [0.22, 1, 0.36, 1] as const
const SOFT = [0.45, 0, 0.55, 1] as const
const DURATION = 2

// TODO: плейсхолдер — оттенки фона слайдов, пока у квизов нет картинок
const PLACEHOLDER_HUES = [300, 350, 250]

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: `${dir * 4}%`, scale: 1.06, zIndex: 1 }),
  center: { opacity: 1, x: '0%', scale: 1, zIndex: 1 },
  exit: (dir: number) => ({
    x: `${dir * -2}%`,
    scale: 1.06,
    zIndex: 0,
    transition: { duration: DURATION, ease: SOFT, zIndex: { duration: 0 } },
  }),
}

const word = {
  enter: { opacity: 0, y: '35%', filter: 'blur(10px)' },
  center: (i: number) => ({
    opacity: 1,
    y: '0%',
    filter: 'blur(0px)',
    transition: { duration: 1.7, ease: EASE, delay: 0.6 + i * 0.08 },
  }),
  exit: {
    opacity: 0,
    y: '-25%',
    filter: 'blur(10px)',
    transition: { duration: 0.8, ease: SOFT },
  },
}

interface Props {
  quizzes: Quiz[]
}

export default function Hero({ quizzes }: Props) {
  const [[index, direction], setSlide] = useState([0, 1])
  const quiz = quizzes[index]

  const go = (next: number, dir = next > index ? 1 : -1) => {
    if (next === index) return
    setSlide([(next + quizzes.length) % quizzes.length, dir])
  }

  if (!quiz) return null

  return (
    <MotionConfig reducedMotion="user">
      <section className={styles.hero} aria-roledescription="carousel" aria-label="Featured quizzes" data-nav="var(--nav-on-accent)">
        <AnimatePresence initial={false} custom={direction}>
          <motion.article
            key={quiz.id}
            className={`${styles.slide} ${quiz.imageUrl ? '' : styles.placeholder}`}
            style={{ '--hue': PLACEHOLDER_HUES[index % PLACEHOLDER_HUES.length] } as CSSProperties}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: DURATION, ease: SOFT }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = offset.x + velocity.x * 0.2
              if (swipe < -SWIPE) go(index + 1, 1)
              else if (swipe > SWIPE) go(index - 1, -1)
            }}
          >
            {quiz.imageUrl && (
              <motion.img
                className={styles.image}
                src={quiz.imageUrl}
                alt=""
                draggable={false}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.4, ease: EASE }}
              />
            )}
            <h2 className={styles.title}>
              {quiz.title.split(' ').map((text, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  <motion.span className={styles.word} custom={i} variants={word}>
                    {text}
                  </motion.span>
                </span>
              ))}
            </h2>
          </motion.article>
        </AnimatePresence>

        <div className={styles.dots}>
          {quizzes.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={`${styles.dot} ${i === index ? styles.active : ''}`}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
            >
              {i === index && (
                <span
                  className={styles.fill}
                  style={{ animationDuration: `${AUTOPLAY}ms` }}
                  onAnimationEnd={() => go(index + 1, 1)}
                />
              )}
            </button>
          ))}
        </div>
      </section>
    </MotionConfig>
  )
}
