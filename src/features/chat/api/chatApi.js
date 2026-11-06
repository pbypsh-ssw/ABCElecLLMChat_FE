import { CHAT_TIMEOUT_MS } from '../constants/api.js'
import { toAnswerText, toChatRequest } from './chatDto.js'

const CHAT_URL = `${import.meta.env.VITE_API_BASE_URL}/chat`

// signal은 화면을 떠날 때의 취소에 쓰고, 제한 시간은 여기서 함께 건다.
export async function requestChatAnswer(question, signal) {
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toChatRequest(question)),
    signal: AbortSignal.any([signal, AbortSignal.timeout(CHAT_TIMEOUT_MS)]),
  })

  if (!response.ok) {
    throw new Error(`Chat API responded with ${response.status}`)
  }
  return toAnswerText(await response.json())
}
