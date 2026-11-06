import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_CLEAR_COMMAND } from '../constants/commands.js'
import { clearChat, loadChatHistory, sendChatMessage } from './chatSlice.js'

export function useChat() {
  const dispatch = useDispatch()
  const sendRequestRef = useRef(null)
  const { messages, historyStatus, sendStatus, clearStatus, hasSaveFailed } =
    useSelector((state) => state.chat)

  useEffect(() => {
    dispatch(loadChatHistory())
  }, [dispatch])

  // 화면을 떠난 뒤 도착한 응답이 상태를 바꾸지 않도록 진행 중인 요청을 취소한다.
  useEffect(() => () => sendRequestRef.current?.abort(), [])

  const retryHistory = useCallback(
    () => dispatch(loadChatHistory()),
    [dispatch],
  )
  const send = useCallback(
    (text) => {
      if (text === CHAT_CLEAR_COMMAND) {
        dispatch(clearChat())
        return
      }
      sendRequestRef.current = dispatch(sendChatMessage(text))
    },
    [dispatch],
  )

  return {
    messages,
    historyStatus,
    sendStatus,
    clearStatus,
    hasSaveFailed,
    retryHistory,
    send,
  }
}
