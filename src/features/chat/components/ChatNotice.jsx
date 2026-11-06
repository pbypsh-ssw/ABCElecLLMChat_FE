function ChatNotice({ message, isError = false, actionLabel, onAction }) {
  return (
    <div className="chat-notice" role={isError ? 'alert' : 'status'}>
      <p
        className={`text-label ${isError ? 'color-chat-error' : 'color-muted'}`}
      >
        {message}
      </p>
      {onAction && (
        <button
          className="chat-notice__action o-button o-pill text-label color-white bg-chatbot hover-chatbot"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default ChatNotice
