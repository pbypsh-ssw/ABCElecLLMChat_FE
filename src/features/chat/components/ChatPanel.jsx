import botImage from '../../../assets/design/bot.svg'
import { t } from '../../../core/i18n/index.js'
import { useScrollToEnd } from '../../../shared/hooks/useScrollToEnd.js'
import { MESSAGE_ROLE } from '../domain/message.js'
import {
  CLEAR_STATUS,
  HISTORY_STATUS,
  SEND_STATUS,
} from '../store/chatSlice.js'
import { useChat } from '../store/useChat.js'
import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'
import ChatNotice from './ChatNotice.jsx'
import ChatTyping from './ChatTyping.jsx'

function ChatPanel({ id, onClose }) {
  const {
    messages,
    historyStatus,
    sendStatus,
    clearStatus,
    hasSaveFailed,
    retryHistory,
    send,
  } = useChat()
  const listRef = useScrollToEnd(
    `${messages.length}-${sendStatus}-${clearStatus}`,
  )
  // 답변을 저장하는 동안에도 전송 중 상태이므로, 답변이 이미 보이면 점을 숨긴다.
  const isWaitingForAnswer =
    sendStatus === SEND_STATUS.SENDING &&
    messages.at(-1)?.role === MESSAGE_ROLE.USER

  return (
    <section
      id={id}
      className="chat-panel bg-white border-chat-outline"
      aria-label={t('chat.title')}
    >
      <header className="chat-panel__header color-white bg-chatbot">
        <img className="chat-panel__icon" src={botImage} alt="" />
        <h2 className="chat-panel__title text-heading-sm font-bold">
          {t('chat.title')}
        </h2>
        {onClose && (
          <button
            className="chat-panel__close o-button color-white bg-transparent"
            type="button"
            onClick={onClose}
            aria-label={t('chat.close')}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M2 2L18 18M18 2L2 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </header>

      <div className="chat-panel__messages" ref={listRef} role="log">
        {/* 인사말은 대화가 없을 때의 안내 역할도 한다. */}
        <ChatMessage
          role={MESSAGE_ROLE.BOT}
          text={t('chat.greeting')}
          isGreeting
        />
        {historyStatus === HISTORY_STATUS.LOADING && (
          <ChatNotice message={t('chat.history.loading')} />
        )}
        {historyStatus === HISTORY_STATUS.FAILED && (
          <ChatNotice
            message={t('chat.history.error')}
            isError
            actionLabel={t('chat.history.retry')}
            onAction={retryHistory}
          />
        )}
        {messages.map(({ id: messageId, role, text }) => (
          <ChatMessage key={messageId} role={role} text={text} />
        ))}
        {isWaitingForAnswer && <ChatTyping />}
        {sendStatus === SEND_STATUS.FAILED && (
          <ChatNotice message={t('chat.sendError')} isError />
        )}
        {hasSaveFailed && <ChatNotice message={t('chat.saveError')} isError />}
        {clearStatus === CLEAR_STATUS.FAILED && (
          <ChatNotice message={t('chat.clearError')} isError />
        )}
      </div>

      <ChatInput
        onSend={send}
        disabled={
          sendStatus === SEND_STATUS.SENDING ||
          clearStatus === CLEAR_STATUS.CLEARING
        }
      />
    </section>
  )
}

export default ChatPanel
