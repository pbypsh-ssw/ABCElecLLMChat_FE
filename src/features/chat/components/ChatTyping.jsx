import { t } from '../../../core/i18n/index.js'

function ChatTyping() {
  return (
    <div className="chat-message" role="status">
      <p className="chat-message__name text-micro color-muted">
        {t('chat.botName')}
      </p>
      <p className="chat-message__bubble text-body leading-loose bg-chat-bubble color-muted">
        <span className="chat-typing__dot" aria-hidden="true" />
        <span className="chat-typing__dot" aria-hidden="true" />
        <span className="chat-typing__dot" aria-hidden="true" />
        {/* 점은 화면 낭독기가 읽지 못하므로 같은 뜻의 문구를 숨겨서 둔다. */}
        <span className="chat-typing__label">{t('chat.sending')}</span>
      </p>
    </div>
  )
}

export default ChatTyping
