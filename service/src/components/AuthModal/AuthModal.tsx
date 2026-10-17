import { useContext, useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { useLenis } from 'lenis/react'
import { AnimatePresence, MotionConfig, PresenceContext, motion, useAnimate } from 'motion/react'
import googleIcon from '../../assets/google.png'
import styles from './AuthModal.module.css'

const EASE = [0.65, 0, 0.35, 1] as const

type Mode = 'login' | 'register' | 'forgot'
type FieldName = 'email' | 'password' | 'confirm'
type Errors = Partial<Record<FieldName, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PASSWORD_MIN = 4
const PASSWORD_MAX = 25

const AUTO_LINKS =
  window.matchMedia('(hover: none)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TITLES: Record<Mode, string> = { login: 'Log in', register: 'Sign up', forgot: 'Reset password' }
const SUBTITLES: Record<Mode, string> = {
  login: "don't have an account?",
  register: 'already have an account?',
  forgot: 'remember your password?',
}
const SUBMIT_LABELS: Record<Mode, string> = { login: 'Log in', register: 'Sign up', forgot: 'Send reset link' }

const PHRASES = {
  register: ['register new account', 'create an account', 'join Balb today'],
  login: ['log in to my account', 'welcome back', 'back to log in'],
  forgot: ['reset my password', 'recover my access', "forgot it? no worries"],
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [attempt, setAttempt] = useState(0)
  const [sent, setSent] = useState(false)

  const isLogin = mode === 'login';
  const isForgot = mode === 'forgot'
  const autoLinks = open && AUTO_LINKS
  const canSubmit = isForgot ? email.length > 0 && !sent : isLogin ? password.length > 0 : confirm.length > 0;

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      setMode('login')
      setEmail('')
      setPassword('')
      setConfirm('')
      setErrors({})
      setSent(false)
      dialog.autofocus = window.matchMedia('(pointer: coarse)').matches
      dialog.showModal()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
  }, [open, lenis])

  const goTo = (next: Mode) => {
    setMode(next)
    setPassword('')
    setConfirm('')
    setErrors({})
    setSent(false)
  }

  const clearError = (field: FieldName) => setErrors((prev) => ({ ...prev, [field]: undefined }))

  const validate = () => {
    const found: Errors = {}
    if (!email.trim()) found.email = 'Enter your email'
    else if (!EMAIL_PATTERN.test(email.trim())) found.email = 'Enter a valid email, like name@mail.com'
    if (isForgot) return found
    if (password.length < PASSWORD_MIN) found.password = `Password must be at least ${PASSWORD_MIN} characters`
    else if (password.length > PASSWORD_MAX) found.password = `Password must be at most ${PASSWORD_MAX} characters`
    if (mode === 'register' && confirm !== password) found.confirm = "Passwords don't match"
    return found
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    setAttempt((a) => a + 1)
    if (Object.keys(found).length > 0) return
    if (isForgot) {
      // TODO(auth): POST /auth/forgot-password — send reset link to email
      setSent(true)
      return
    }
    // TODO(auth): POST /auth/login or /auth/register (src/api/auth.ts)
    // TODO(auth): server errors → setErrors: wrong email or password (login), email already registered (register)
  }

  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose} onCancel={(e) => e.preventDefault()}>
      <MotionConfig reducedMotion="user">
        <div className={styles.card}>
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
            <span className={styles.closeIcon} />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <h2 className={styles.title}>{TITLES[mode]}</h2>
              <p className={styles.subtitle}>
                {SUBTITLES[mode]}{' '}
                <TextLink
                  key={mode}
                  phrases={isLogin ? PHRASES.register : PHRASES.login}
                  auto={autoLinks}
                  onClick={() => goTo(isLogin ? 'register' : 'login')}
                >
                  {isLogin ? 'register' : 'log in'}
                </TextLink>
              </p>
            </motion.div>
          </AnimatePresence>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Field error={errors.email} attempt={attempt}>
              <input
                className={styles.input}
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearError('email')
                  setSent(false)
                }}
              />
            </Field>

            <AnimatePresence initial={false}>
              {!isForgot && (
                <Collapse key="password">
                  <Field error={errors.password} attempt={attempt}>
                    <PasswordInput
                      placeholder="Password"
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      aria-invalid={!!errors.password}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearError('password')
                      }}
                    />
                  </Field>
                </Collapse>
              )}

              {mode === 'register' && (
                <Collapse key="confirm">
                  <Field error={errors.confirm} attempt={attempt}>
                    <PasswordInput
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      required
                      aria-invalid={!!errors.confirm}
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value)
                        clearError('confirm')
                      }}
                    />
                  </Field>
                </Collapse>
              )}

              {isLogin && (
                <Collapse key="forgot">
                  <TextLink phrases={PHRASES.forgot} auto={autoLinks} onClick={() => goTo('forgot')}>
                    forgot password
                  </TextLink>
                </Collapse>
              )}

              {sent && (
                <Collapse key="sent">
                  <p className={styles.notice} role="status">
                    Check your inbox — we sent a reset link to {email.trim()}
                  </p>
                </Collapse>
              )}

              {canSubmit && (
                <Collapse key="submit">
                  <motion.div
                    className={styles.submitWrap}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <SubmitButton>{SUBMIT_LABELS[mode]}</SubmitButton>
                  </motion.div>
                </Collapse>
              )}
            </AnimatePresence>
          </form>

          <AnimatePresence initial={false}>
            {!isForgot && (
              <Collapse key="social" inner={styles.social}>
                {/* TODO(auth): Sign in with Apple */}
                <button type="button" className={`${styles.socialButton} ${styles.apple}`}>
                  <span className={styles.appleIcon} />
                  Continue with Apple
                </button>
                {/* TODO(auth): Sign in with Google */}
                <button type="button" className={`${styles.socialButton} ${styles.google}`}>
                  <img className={styles.googleIcon} src={googleIcon} alt="" />
                  Continue with Google
                </button>
              </Collapse>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </dialog>
  )
}

function SubmitButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let frame = 0

    const tick = () => {
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      el.style.setProperty('--x', `${x}px`)
      el.style.setProperty('--y', `${y}px`)
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }

    const setTarget = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    }

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      setTarget(e)
      x = targetX
      y = targetY
      tick()
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      setTarget(e)
      if (!frame) frame = requestAnimationFrame(tick)
    }

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button ref={ref} type="submit" className={styles.submit}>
      {children}
    </button>
  )
}

function TextLink({
  children,
  phrases,
  auto = false,
  onClick,
}: {
  children: string
  phrases: string[]
  auto?: boolean
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const sequence = auto ? [children, ...phrases] : phrases
  const target = auto || active ? sequence[index % sequence.length] : children
  const text = useTyping(target, children)

  useEffect(() => {
    if (text !== target) return
    if (!auto && !active) {
      if (ref.current) ref.current.style.width = ''
      return
    }
    const id = setTimeout(() => setIndex((i) => (i + 1) % sequence.length), auto ? 6000 : 2000)
    return () => clearTimeout(id)
  }, [text, target, active, auto, sequence.length])

  const on = () => {
    if (auto) return
    if (ref.current) ref.current.style.width = `${ref.current.offsetWidth}px`
    setIndex(0)
    setActive(true)
  }
  const off = () => setActive(false)

  return (
    <button
      ref={ref}
      type="button"
      className={styles.link}
      aria-label={children}
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType === 'mouse' && on()}
      onPointerLeave={off}
      onFocus={on}
      onBlur={off}
    >
      <Typed text={text} caret={(active && !auto) || text !== target} />
    </button>
  )
}

function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.passwordField}>
      <input {...props} className={styles.input} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className={styles.eye}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
          <circle className={styles.pupil} cx="12" cy="12" r="3" />
          <path className={styles.slash} d="M4 4l16 16" />
        </svg>
      </button>
    </div>
  )
}

function useTyping(target: string, initial: string, speed = 65) {
  const [text, setText] = useState(initial)
  const wasDeleting = useRef(false)

  useEffect(() => {
    if (text === target) return
    const deleting = !target.startsWith(text)
    const delay = deleting ? speed * 0.55 : wasDeleting.current ? 300 : speed
    const id = setTimeout(() => {
      wasDeleting.current = deleting
      setText(deleting ? text.slice(0, -1) : target.slice(0, text.length + 1))
    }, delay)
    return () => clearTimeout(id)
  }, [text, target, speed])

  return text
}

function Typed({ text, caret }: { text: string; caret: boolean }) {
  return (
    <span aria-hidden="true">
      {[...text.matchAll(/\S+|\s+/g)].map(({ 0: token, index }) =>
        /\s/.test(token) ? (
          <span key={index}> </span>
        ) : (
          <span key={index} className={styles.word}>
            {[...token].map((char, i) => (
              <span key={i} className={styles.char}>
                {char}
              </span>
            ))}
          </span>
        ),
      )}
      {caret && <span className={styles.caret} />}
    </span>
  )
}

function Field({ error, attempt, children }: { error?: string; attempt: number; children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLDivElement>()

  useEffect(() => {
    if (error) animate(scope.current, { x: [0, -10, 9, -6, 5, -2, 0] }, { duration: 0.55, ease: 'easeInOut' })
  }, [attempt, error, animate, scope])

  return (
    <div className={styles.field}>
      <div ref={scope}>{children}</div>
      <AnimatePresence initial={false}>
        {error && (
          <Collapse key="error" inner={styles.errorInner}>
            <ErrorText message={error} />
          </Collapse>
        )}
      </AnimatePresence>
    </div>
  )
}

function ErrorText({ message }: { message: string }) {
  const text = useTyping(message, '', 22)

  return (
    <p className={styles.error} role="alert">
      <span className={styles.srOnly}>{message}</span>
      <Typed text={text} caret={text !== message} />
    </p>
  )
}

function Collapse({ children, inner = styles.collapseInner }: { children: ReactNode; inner?: string }) {
  const shownWithoutAnimation = useContext(PresenceContext)?.initial === false
  const [animating, setAnimating] = useState(!shownWithoutAnimation)

  return (
    <motion.div
      style={{ overflow: animating ? 'hidden' : 'visible' }}
      onAnimationStart={() => setAnimating(true)}
      onAnimationComplete={() => setAnimating(false)}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        transition: { height: { duration: 0.7, ease: EASE }, opacity: { duration: 0.5, ease: EASE, delay: 0.15 } },
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: { opacity: { duration: 0.35, ease: EASE }, height: { duration: 0.6, ease: EASE, delay: 0.1 } },
      }}
    >
      <div className={inner}>{children}</div>
    </motion.div>
  )
}
