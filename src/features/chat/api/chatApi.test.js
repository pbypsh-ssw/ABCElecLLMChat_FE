import { afterEach, describe, expect, it, vi } from 'vitest'
import { CHAT_TIMEOUT_MS } from '../constants/api.js'
import { requestChatAnswer } from './chatApi.js'
import { toChatRequest } from './chatDto.js'

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status })
}

function waitForAbort(_, { signal }) {
  return new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason))
  })
}

const signal = () => new AbortController().signal

describe('toChatRequest', () => {
  it('명세의 필드와 KST 날짜 형식으로 만든다', () => {
    expect(toChatRequest('안녕', new Date('2026-11-03T05:37:00Z'))).toEqual({
      user_id: 'user',
      session_id: 'test-session',
      date: '2026-11-03 14:37:00',
      question: '안녕',
    })
  })
})

describe('requestChatAnswer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('성공 응답에서 답변만 꺼낸다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          success: true,
          error: null,
          response: { answer: '안녕하세요' },
        }),
      ),
    )
    await expect(requestChatAnswer('안녕', signal())).resolves.toBe(
      '안녕하세요',
    )
  })

  it.each([422, 500])('HTTP %i이면 실패한다', async (status) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(status, { success: false })),
    )
    await expect(requestChatAnswer('안녕', signal())).rejects.toThrow(
      String(status),
    )
  })

  it('답변이 비어 있으면 실패한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(200, {
          success: true,
          error: null,
          response: { answer: '' },
        }),
      ),
    )
    await expect(requestChatAnswer('안녕', signal())).rejects.toThrow()
  })

  it('제한 시간 값을 30초로 둔다', () => {
    expect(CHAT_TIMEOUT_MS).toBe(30000)
  })

  it('호출한 쪽에서 취소하면 요청이 끊긴다', async () => {
    vi.stubGlobal('fetch', vi.fn(waitForAbort))
    const controller = new AbortController()
    const request = requestChatAnswer('안녕', controller.signal)
    controller.abort()
    await expect(request).rejects.toThrow()
  })
})
