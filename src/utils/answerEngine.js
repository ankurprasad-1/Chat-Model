/*import Fuse from 'fuse.js'
import qa from '../data/dummyQuestions.json'

const fuse = new Fuse(qa, {
  keys: ['question'],
  includeScore: true,
  threshold: 0.5,
  ignoreLocation: true,
  distance: 100
})

const CUTOFF = 0.4  // accept only good matches (0 = perfect)

export function getAnswer(userText) {
  const text = (userText || '').trim().toLowerCase()
  if (!text) return "You have not asked anything yet. Please type your question again"

  const [hit] = fuse.search(text) || []
  if (!hit || hit.score > CUTOFF) {
    return "I cannot answer that. Please try asking something else."
  }
  return hit.item.answer
}*/

