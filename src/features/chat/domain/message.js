import { createId } from '../../../core/utils/createId.js'

export const MESSAGE_ROLE = {
  USER: 'user',
  BOT: 'bot',
}

export function createMessage(role, text) {
  return { id: createId(), role, text }
}

// 저장소 전용 필드(seq)가 화면과 store로 새어 나가지 않도록 받자마자 변환한다.
export function toMessage({ id, role, text }) {
  return { id, role, text }
}
