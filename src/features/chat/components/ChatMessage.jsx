import { t } from '../../../core/i18n/index.js'
import { MESSAGE_ROLE } from '../domain/message.js'

function ChatMessage({ role, text, isGreeting = false }) {
  const isBot = role === MESSAGE_ROLE.BOT
  const bubbleClass = [
    'chat-message__bubble text-body leading-loose',
    isBot ? 'bg-chat-bubble color-navy' : 'bg-chatbot color-white',
    isGreeting && 'first-line-action',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`chat-message chat-message--${role}`}>
      {isBot && (
        <p className="chat-message__name text-micro color-muted">
          {t('chat.botName')}
        </p>
      )}
      <p className={bubbleClass}>{text}</p>
    </div>
  )
}

export default ChatMessage
