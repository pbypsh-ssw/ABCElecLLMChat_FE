import { useState } from 'react'
import { t } from '../../../core/i18n/index.js'
import { CHAT_QUESTION_MAX_LENGTH } from '../constants/api.js'

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const text = value.trim()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text || disabled) return

    onSend(text)
    setValue('')
  }

  return (
    <form className="chat-input o-pill bg-chat-input" onSubmit={handleSubmit}>
      <input
        className="chat-input__field text-body color-navy bg-transparent placeholder-muted"
        type="text"
        maxLength={CHAT_QUESTION_MAX_LENGTH}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('chat.placeholder')}
        aria-label={t('chat.inputLabel')}
        autoComplete="off"
        autoFocus
      />
      <button
        className="chat-input__send o-button color-white bg-chatbot"
        type="submit"
        disabled={!text || disabled}
        aria-label={t('chat.send')}
      >
        <svg viewBox="0 0 16 18" fill="none" aria-hidden="true">
          <path
            d="M8 17V1M14 7L8 1L2 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  )
}

export default ChatInput
