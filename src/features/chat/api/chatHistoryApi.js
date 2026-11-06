import { runInStore, STORES } from '../../../core/database/index.js'
import { toMessage } from '../domain/message.js'

// 서버 대신 브라우저의 IndexedDB에 대화를 보관한다. 데이터를 바깥에서 받는 경계라 api에 둔다.
export async function getChatHistory() {
  const records = await runInStore(STORES.CHAT_MESSAGES, 'readonly', (store) =>
    store.getAll(),
  )
  return records.map(toMessage)
}

export function saveChatMessage(message) {
  return runInStore(STORES.CHAT_MESSAGES, 'readwrite', (store) =>
    store.add(message),
  )
}

export function clearChatHistory() {
  return runInStore(STORES.CHAT_MESSAGES, 'readwrite', (store) => store.clear())
}
