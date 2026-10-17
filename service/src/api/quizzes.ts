import type { Quiz } from '../types'

const titles = [
  { title: 'How supportive are you of feminist ideas?', duration: 7 },
  { title: "What's your villain era rating?", duration: 12 },
  { title: 'What kind of serial killer would you be?', duration: 18 },
  { title: 'How racist and homophobic are you, really?', duration: 9 },
]

// TODO: заглушка
export const quizzes: Quiz[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  ...titles[i % titles.length],
  imageUrl: null,
}))
