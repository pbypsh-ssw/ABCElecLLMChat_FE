import { CHAT_SESSION_ID, CHAT_USER_ID } from '../constants/api.js'

/**
 * @typedef {object} ChatRequest
 * @property {string} user_id
 * @property {string} session_id
 * @property {string} date KST, YYYY-MM-DD HH:mm:ss
 * @property {string} question
 */

/**
 * @typedef {object} ChatResponseBody
 * @property {boolean} success
 * @property {{ status_code: number, err_msg: string } | null} error
 * @property {{ user_id: string, session_id: string, date: string, answer: string } | null} response
 */

// sv-SE는 표시용이 아니라 명세의 날짜 형식(YYYY-MM-DD HH:mm:ss)과 같아서 쓴다.
// 사용자 PC의 시간대와 상관없이 서버가 요구하는 KST로 보낸다.
const kstFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  dateStyle: 'short',
  timeStyle: 'medium',
})

/** @returns {ChatRequest} */
export function toChatRequest(question, now = new Date()) {
  return {
    user_id: CHAT_USER_ID,
    session_id: CHAT_SESSION_ID,
    date: kstFormatter.format(now),
    question,
  }
}

/** @param {ChatResponseBody} body */
export function toAnswerText(body) {
  if (!body.success || !body.response?.answer) {
    throw new Error('Chat API returned no answer')
  }
  return body.response.answer
}
