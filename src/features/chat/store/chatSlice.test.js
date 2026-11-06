import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { requestChatAnswer } from '../api/chatApi.js'
import {
  clearChatHistory,
  getChatHistory,
  saveChatMessage,
} from '../api/chatHistoryApi.js'
import chatReducer, {
  CLEAR_STATUS,
  clearChat,
  HISTORY_STATUS,
  loadChatHistory,
  SEND_STATUS,
  sendChatMessage,
} from './chatSlice.js'

vi.mock('../api/chatApi.js', () => ({ requestChatAnswer: vi.fn() }))
vi.mock('../api/chatHistoryApi.js', () => ({
  clearChatHistory: vi.fn(),
  getChatHistory: vi.fn(),
  saveChatMessage: vi.fn(),
}))

function createStore() {
  return configureStore({ reducer: { chat: chatReducer } })
}

describe('chatSlice', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    requestChatAnswer.mockResolvedValue('답변')
  })

  it('불러오기에 실패하면 FAILED가 되고 다시 시도하면 성공한다', async () => {
    const store = createStore()
    getChatHistory.mockRejectedValueOnce(new Error('blocked'))
    await store.dispatch(loadChatHistory())
    expect(store.getState().chat.historyStatus).toBe(HISTORY_STATUS.FAILED)

    getChatHistory.mockResolvedValueOnce([
      { id: 'a', role: 'user', text: '안녕' },
    ])
    await store.dispatch(loadChatHistory())
    expect(store.getState().chat.historyStatus).toBe(HISTORY_STATUS.LOADED)
    expect(store.getState().chat.messages).toHaveLength(1)
  })

  it('대화를 지우면 메시지와 오류 안내가 사라진다', async () => {
    const store = createStore()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    requestChatAnswer.mockRejectedValueOnce(new Error('500'))
    await store.dispatch(sendChatMessage('정수기'))
    expect(store.getState().chat.sendStatus).toBe(SEND_STATUS.FAILED)

    await store.dispatch(clearChat())
    expect(clearChatHistory).toHaveBeenCalledTimes(1)
    expect(store.getState().chat.messages).toEqual([])
    expect(store.getState().chat.sendStatus).toBe(SEND_STATUS.IDLE)
    error.mockRestore()
  })

  it('지우기에 실패하면 대화를 남기고 FAILED가 된다', async () => {
    const store = createStore()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await store.dispatch(sendChatMessage('정수기'))
    clearChatHistory.mockRejectedValueOnce(new Error('blocked'))

    await store.dispatch(clearChat())
    expect(store.getState().chat.clearStatus).toBe(CLEAR_STATUS.FAILED)
    expect(store.getState().chat.messages).toHaveLength(2)
    error.mockRestore()
  })

  it('전송 중에는 지우지 않는다', async () => {
    const store = createStore()
    const request = store.dispatch(sendChatMessage('정수기'))
    await store.dispatch(clearChat())
    await request
    expect(clearChatHistory).not.toHaveBeenCalled()
    expect(store.getState().chat.messages).toHaveLength(2)
  })

  it('이미 불러왔다면 다시 읽지 않는다', async () => {
    const store = createStore()
    getChatHistory.mockResolvedValue([])
    await store.dispatch(loadChatHistory())
    await store.dispatch(loadChatHistory())
    expect(getChatHistory).toHaveBeenCalledTimes(1)
  })

  it('성공하면 질문과 답변이 쌓인다', async () => {
    const store = createStore()
    await store.dispatch(sendChatMessage('정수기'))
    expect(store.getState().chat.messages.map(({ text }) => text)).toEqual([
      '정수기',
      '답변',
    ])
    expect(store.getState().chat.sendStatus).toBe(SEND_STATUS.IDLE)
  })

  it('전송 중에 다시 보내도 한 번만 처리한다', async () => {
    const store = createStore()
    await Promise.all([
      store.dispatch(sendChatMessage('정수기')),
      store.dispatch(sendChatMessage('정수기')),
    ])
    expect(requestChatAnswer).toHaveBeenCalledTimes(1)
    expect(store.getState().chat.messages).toHaveLength(2)
  })

  it('답변을 못 받으면 FAILED가 되고 질문은 남는다', async () => {
    const store = createStore()
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    requestChatAnswer.mockRejectedValue(new Error('500'))
    await store.dispatch(sendChatMessage('정수기'))
    expect(store.getState().chat.sendStatus).toBe(SEND_STATUS.FAILED)
    expect(store.getState().chat.messages).toHaveLength(1)
    error.mockRestore()
  })

  it('화면을 떠나 취소되면 오류로 표시하지 않는다', async () => {
    const store = createStore()
    requestChatAnswer.mockImplementation(
      (_, signal) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(signal.reason))
        }),
    )
    const request = store.dispatch(sendChatMessage('정수기'))
    await vi.waitFor(() => expect(requestChatAnswer).toHaveBeenCalled())
    request.abort()
    await request
    expect(store.getState().chat.sendStatus).toBe(SEND_STATUS.IDLE)
  })

  it('저장에 실패해도 대화는 이어지고 실패가 기록된다', async () => {
    const store = createStore()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    saveChatMessage.mockRejectedValue(new Error('blocked'))
    await store.dispatch(sendChatMessage('정수기'))
    expect(store.getState().chat.messages).toHaveLength(2)
    expect(store.getState().chat.hasSaveFailed).toBe(true)
    warn.mockRestore()
  })
})
