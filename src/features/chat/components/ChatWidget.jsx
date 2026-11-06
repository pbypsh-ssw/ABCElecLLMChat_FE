import { useCallback, useRef, useState } from 'react'
import botImage from '../../../assets/design/bot.svg'
import { t } from '../../../core/i18n/index.js'
import { useEscapeKey } from '../../../shared/hooks/useEscapeKey.js'
import { chatCssVariables } from '../constants/cssVariables.js'
import {
  chatPanelDefaultHeight,
  chatPanelMinHeight,
  chatPanelResizeStep,
  chatPanelResizeTopGap,
} from '../constants/sizes.js'
import ChatPanel from './ChatPanel.jsx'
import { useResizableHeight } from './useResizableHeight.js'
import '../design.css'

const PANEL_ID = 'chat-widget-panel'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const launcherRef = useRef(null)
  const { height, containerRef, handleProps } = useResizableHeight({
    initialHeight: parseFloat(chatPanelDefaultHeight),
    minHeight: parseFloat(chatPanelMinHeight),
    topOffset: parseFloat(chatPanelResizeTopGap),
    step: chatPanelResizeStep,
  })

  // 닫으면 포커스가 있던 입력창이 사라지므로 키보드 사용자를 위해 버튼으로 되돌린다.
  const close = useCallback(() => {
    setIsOpen(false)
    launcherRef.current?.focus()
  }, [])

  useEscapeKey(close, isOpen)

  return (
    <>
      {isOpen && (
        <div
          ref={containerRef}
          className="chat-widget__panel"
          style={{ ...chatCssVariables, '--chat-panel-height': `${height}px` }}
        >
          <div
            className="chat-widget__resize"
            role="separator"
            aria-orientation="horizontal"
            aria-label={t('chat.resize')}
            tabIndex={0}
            {...handleProps}
          />
          <ChatPanel id={PANEL_ID} onClose={close} />
        </div>
      )}
      <button
        ref={launcherRef}
        className="chat-widget__launcher o-button o-pill text-action color-white bg-chatbot hover-chatbot"
        style={chatCssVariables}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? PANEL_ID : undefined}
      >
        <img className="chat-widget__icon" src={botImage} alt="" />
        {t('chat.launcher')}
      </button>
    </>
  )
}

export default ChatWidget
