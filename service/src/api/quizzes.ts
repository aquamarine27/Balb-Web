import type { Quiz } from '../types'

const titles = [
  { title: 'How supportive are you of feminist ideas?', duration: 7, category: 'politics' },
  { title: "What's your villain era rating?", duration: 12, category: 'personality' },
  { title: 'Which red flag would your ex call you?', duration: 6, category: 'love' },
  { title: 'How basic is your music taste?', duration: 5, category: 'tastes' },
  { title: 'What kind of serial killer would you be?', duration: 18, category: 'spicy' },
  { title: 'How racist and homophobic are you, really?', duration: 9, category: 'politics' },
]

// TODO: заглушка
export const quizzes: Quiz[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  ...titles[i % titles.length],
  imageUrl: null,
}))
