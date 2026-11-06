import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { requestChatAnswer } from '../api/chatApi.js'
import {
  clearChatHistory,
  getChatHistory,
  saveChatMessage,
} from '../api/chatHistoryApi.js'
import { createMessage, MESSAGE_ROLE } from '../domain/message.js'

export const HISTORY_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
}

export const SEND_STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  FAILED: 'failed',
}

export const CLEAR_STATUS = {
  IDLE: 'idle',
  CLEARING: 'clearing',
  FAILED: 'failed',
}

// 패널과 전체 화면 채팅이 같은 대화를 보여 주므로 메시지를 store에 둔다.
const initialState = {
  messages: [],
  historyStatus: HISTORY_STATUS.IDLE,
  sendStatus: SEND_STATUS.IDLE,
  clearStatus: CLEAR_STATUS.IDLE,
  hasSaveFailed: false,
}

// 전송과 삭제가 겹치면 지운 직후 답변이 다시 저장될 수 있어 한 번에 하나만 실행한다.
function isChatIdle({ sendStatus, clearStatus }) {
  return (
    sendStatus !== SEND_STATUS.SENDING && clearStatus !== CLEAR_STATUS.CLEARING
  )
}

export const loadChatHistory = createAsyncThunk(
  'chat/loadHistory',
  () => getChatHistory(),
  {
    // 두 화면이 각각 요청해도 한 번만 읽고, 실패했을 때만 다시 읽는다.
    condition: (_, { getState }) => {
      const { historyStatus } = getState().chat
      return (
        historyStatus === HISTORY_STATUS.IDLE ||
        historyStatus === HISTORY_STATUS.FAILED
      )
    },
  },
)

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (text, { dispatch, signal }) => {
    const postMessage = async (role, content) => {
      const message = createMessage(role, content)
      dispatch(messageAdded(message))

      // 저장에 실패해도(시크릿 모드 등) 대화는 이어 가고, 사용자에게는 따로 알린다.
      try {
        await saveChatMessage(message)
      } catch (error) {
        console.warn('Failed to save chat message', error)
        dispatch(messageSaveFailed())
      }
    }

    await postMessage(MESSAGE_ROLE.USER, text)

    let answer
    try {
      answer = await requestChatAnswer(text, signal)
    } catch (error) {
      if (!signal.aborted) console.error('Failed to get chat answer', error)
      throw error
    }
    await postMessage(MESSAGE_ROLE.BOT, answer)
  },
  {
    condition: (_, { getState }) => isChatIdle(getState().chat),
  },
)

export const clearChat = createAsyncThunk(
  'chat/clear',
  async () => {
    try {
      await clearChatHistory()
    } catch (error) {
      console.error('Failed to clear chat history', error)
      throw error
    }
  },
  {
    condition: (_, { getState }) => isChatIdle(getState().chat),
  },
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    messageAdded(state, action) {
      state.messages.push(action.payload)
    },
    messageSaveFailed(state) {
      state.hasSaveFailed = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChatHistory.pending, (state) => {
        state.historyStatus = HISTORY_STATUS.LOADING
      })
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        const currentIds = new Set(state.messages.map(({ id }) => id))
        const history = action.payload.filter(({ id }) => !currentIds.has(id))

        state.messages = [...history, ...state.messages]
        state.historyStatus = HISTORY_STATUS.LOADED
      })
      .addCase(loadChatHistory.rejected, (state) => {
        state.historyStatus = HISTORY_STATUS.FAILED
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.sendStatus = SEND_STATUS.SENDING
        state.clearStatus = CLEAR_STATUS.IDLE
      })
      .addCase(sendChatMessage.fulfilled, (state) => {
        state.sendStatus = SEND_STATUS.IDLE
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        // 화면을 떠나 취소한 요청은 사용자에게 보여 줄 오류가 아니다.
        state.sendStatus = action.meta.aborted
          ? SEND_STATUS.IDLE
          : SEND_STATUS.FAILED
      })
      .addCase(clearChat.pending, (state) => {
        state.clearStatus = CLEAR_STATUS.CLEARING
      })
      .addCase(clearChat.fulfilled, (state) => {
        // 저장소가 비었으므로 이전 대화와 관련된 오류 안내도 함께 지운다.
        state.messages = []
        state.historyStatus = HISTORY_STATUS.LOADED
        state.sendStatus = SEND_STATUS.IDLE
        state.clearStatus = CLEAR_STATUS.IDLE
        state.hasSaveFailed = false
      })
      .addCase(clearChat.rejected, (state) => {
        state.clearStatus = CLEAR_STATUS.FAILED
      })
  },
})

const { messageAdded, messageSaveFailed } = chatSlice.actions

export default chatSlice.reducer
